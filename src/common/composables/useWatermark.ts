import type { Ref } from 'vue';
import { debounce } from 'lodash-es';

/** Default configuration */
const DEFAULT_CONFIG = {
  /** Defense (enabled by default, can prevent watermark from being deleted or hidden, but may have performance cost) */
  defense: true,
  /** Text color */
  color: '#c0c4cc',
  /** Text opacity */
  opacity: 0.5,
  /** Text font size */
  size: 16,
  /** Text font family */
  family: 'serif',
  /** Text tilt angle */
  angle: -20,
  /** Width occupied by one watermark (the larger the value, the lower the density) */
  width: 300,
  /** Height occupied by one watermark (the larger the value, the lower the density) */
  height: 200
};

type DefaultConfig = typeof DEFAULT_CONFIG;

interface Observer {
  watermarkElMutationObserver?: MutationObserver;
  parentElMutationObserver?: MutationObserver;
  parentElResizeObserver?: ResizeObserver;
}

/** body element */
const bodyEl = ref<HTMLElement>(document.body);

/**
 * @name Watermark Composable
 * @description 1. You can optionally pass in the container element to mount the watermark, default is body
 * @description 2. Watermark defense is implemented, which can effectively prevent others from deleting or hiding the watermark via the console
 */
export function useWatermark(parentEl: Ref<HTMLElement | null> = bodyEl) {
  // Backup text
  let backupText: string;

  // Final config
  let mergeConfig: DefaultConfig;

  // Watermark element
  let watermarkEl: HTMLElement | null = null;

  // Observer
  const observer: Observer = {
    watermarkElMutationObserver: undefined,
    parentElMutationObserver: undefined,
    parentElResizeObserver: undefined
  };

  // Set watermark
  const setWatermark = (text: string, config: Partial<DefaultConfig> = {}) => {
    if (!parentEl.value) return console.warn('Please call setWatermark after the DOM is mounted');
    // Backup text
    backupText = text;
    // Merge config
    mergeConfig = { ...DEFAULT_CONFIG, ...config };
    // Create or update watermark element
    watermarkEl ? updateWatermarkEl() : createWatermarkEl();
    // Listen for changes to watermark element and container element
    addElListener(parentEl.value);
  };

  // Create watermark element
  const createWatermarkEl = () => {
    const isBody = parentEl.value!.tagName.toLowerCase() === bodyEl.value.tagName.toLowerCase();
    const watermarkElPosition = isBody ? 'fixed' : 'absolute';
    const parentElPosition = isBody ? '' : 'relative';
    watermarkEl = document.createElement('div');
    watermarkEl.style.pointerEvents = 'none';
    watermarkEl.style.top = '0';
    watermarkEl.style.left = '0';
    watermarkEl.style.position = watermarkElPosition;
    watermarkEl.style.zIndex = '99999';
    const { clientWidth, clientHeight } = parentEl.value!;
    updateWatermarkEl({ width: clientWidth, height: clientHeight });
    // Set watermark container to relative positioning
    parentEl.value!.style.position = parentElPosition;
    // Add watermark element to watermark container
    parentEl.value!.appendChild(watermarkEl);
  };

  // Update watermark element
  const updateWatermarkEl = (
    options: Partial<{
      width: number;
      height: number;
    }> = {}
  ) => {
    if (!watermarkEl) return;
    backupText && (watermarkEl.style.background = `url(${createBase64()}) left top repeat`);
    options.width && (watermarkEl.style.width = `${options.width}px`);
    options.height && (watermarkEl.style.height = `${options.height}px`);
  };

  // Create base64 image
  const createBase64 = () => {
    const { color, opacity, size, family, angle, width, height } = mergeConfig;
    const canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    const ctx = canvasEl.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.font = `${size}px ${family}`;
      ctx.rotate((Math.PI / 180) * angle);
      ctx.fillText(backupText, 0, height / 2);
    }
    return canvasEl.toDataURL();
  };

  // Clear watermark
  const clearWatermark = () => {
    if (!parentEl.value || !watermarkEl) return;
    // Remove listeners on watermark element and container element
    removeListener();
    // Remove watermark element
    try {
      parentEl.value.removeChild(watermarkEl);
    } catch {
      // For example, if the user deleted this element in the console when defense is off
      console.warn('Watermark element no longer exists, please recreate it');
    } finally {
      watermarkEl = null;
    }
  };

  // Refresh watermark (called when defense is on)
  const updateWatermark = debounce(() => {
    clearWatermark();
    createWatermarkEl();
    addElListener(parentEl.value!);
  }, 100);

  // Listen for changes to watermark element and container element (DOM changes & DOM size changes)
  const addElListener = (targetNode: HTMLElement) => {
    // Determine if defense is enabled
    if (mergeConfig.defense) {
      // Prevent duplicate listeners
      if (!observer.watermarkElMutationObserver && !observer.parentElMutationObserver) {
        // Listen for DOM changes
        addMutationListener(targetNode);
      }
    } else {
      // No defense, no need for mutation listener
      removeListener('mutation');
    }
    // Prevent duplicate listeners
    if (!observer.parentElResizeObserver) {
      // Listen for DOM size changes
      addResizeListener(targetNode);
    }
  };

  // Remove listeners on watermark element and container element, specify which listener to remove, default removes all listeners
  const removeListener = (kind: 'mutation' | 'resize' | 'all' = 'all') => {
    // Remove mutation listener
    if (kind === 'mutation' || kind === 'all') {
      observer.watermarkElMutationObserver?.disconnect();
      observer.watermarkElMutationObserver = undefined;
      observer.parentElMutationObserver?.disconnect();
      observer.parentElMutationObserver = undefined;
    }
    // Remove resize listener
    if (kind === 'resize' || kind === 'all') {
      observer.parentElResizeObserver?.disconnect();
      observer.parentElResizeObserver = undefined;
    }
  };

  // Listen for DOM changes
  const addMutationListener = (targetNode: HTMLElement) => {
    // Callback executed when changes are observed
    const mutationCallback = debounce((mutationList: MutationRecord[]) => {
      // Watermark defense (to prevent users from manually deleting the watermark element or hiding it via CSS)
      mutationList.forEach(
        debounce((mutation: MutationRecord) => {
          switch (mutation.type) {
            case 'attributes':
              mutation.target === watermarkEl && updateWatermark();
              break;
            case 'childList':
              mutation.removedNodes.forEach((item) => {
                item === watermarkEl && targetNode.appendChild(watermarkEl);
              });
              break;
          }
        }, 100)
      );
    }, 100);
    // Create observer instance and pass callback
    observer.watermarkElMutationObserver = new MutationObserver(mutationCallback);
    observer.parentElMutationObserver = new MutationObserver(mutationCallback);
    // Observe target node with the above configuration
    observer.watermarkElMutationObserver.observe(watermarkEl!, {
      // Observe if attributes of the target node change, default is true
      attributes: true,
      // Observe if nodes are added or deleted, default is false
      childList: false,
      // Whether to extend to observe all descendant nodes, default is false
      subtree: false
    });
    observer.parentElMutationObserver.observe(targetNode, {
      attributes: false,
      childList: true,
      subtree: false
    });
  };

  // Listen for DOM size changes
  const addResizeListener = (targetNode: HTMLElement) => {
    // Update the entire watermark size when the size of the targetNode element changes
    const resizeCallback = debounce(() => {
      const { clientWidth, clientHeight } = targetNode;
      updateWatermarkEl({ width: clientWidth, height: clientHeight });
    }, 500);
    // Create an observer instance and pass the callback
    observer.parentElResizeObserver = new ResizeObserver(resizeCallback);
    // Start observing the target node
    observer.parentElResizeObserver.observe(targetNode);
  };

  // Remove watermark and various listeners before component unmount
  onBeforeUnmount(() => {
    clearWatermark();
  });

  return { setWatermark, clearWatermark };
}
