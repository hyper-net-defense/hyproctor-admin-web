<script lang="ts" setup>
import screenfull from 'screenfull';

// interface Props {
//   /** The element to fullscreen, default is html */
//   element?: string;
//   /** Tooltip for entering fullscreen */
//   openTips?: string;
//   /** Tooltip for exiting fullscreen */
//   exitTips?: string;
//   /** Only target content area */
//   content?: boolean;
// }

// const { element = 'html', openTips = 'Fullscreen', exitTips = 'Exit Fullscreen', content = false } = defineProps<Props>();

const CONTENT_LARGE = 'content-large';

const CONTENT_FULL = 'content-full';

const classList = document.body.classList;

// #region Fullscreen
const isEnabled = screenfull.isEnabled;

const isFullscreen = ref<boolean>(false);

// const fullscreenTips = computed(() => (isFullscreen.value ? exitTips : openTips));

// const fullscreenSvgName = computed(() => (isFullscreen.value ? 'fullscreen-exit' : 'fullscreen'));

// function handleFullscreenClick() {
//   const dom = document.querySelector(element) || undefined;
//   isEnabled ? screenfull.toggle(dom) : ElMessage.warning('Your browser does not support fullscreen');
// }

function handleFullscreenChange() {
  isFullscreen.value = screenfull.isFullscreen;
  // Remove related classes when exiting fullscreen
  isFullscreen.value || classList.remove(CONTENT_LARGE, CONTENT_FULL);
}

watchEffect(() => {
  if (isEnabled) {
    // Automatically execute when component is mounted
    screenfull.on('change', handleFullscreenChange);
    // Automatically execute when component is unmounted
    onWatcherCleanup(() => {
      screenfull.off('change', handleFullscreenChange);
    });
  }
});
// #endregion

// #region Content Area
// const isContentLarge = ref<boolean>(false);

// const contentLargeTips = computed(() => (isContentLarge.value ? 'Restore Content Area' : 'Enlarge Content Area'));

// const contentLargeSvgName = computed(() => (isContentLarge.value ? 'fullscreen-exit' : 'fullscreen'));

// function handleContentLargeClick() {
//   isContentLarge.value = !isContentLarge.value;
//   // Hide unnecessary components when content area is enlarged
//   classList.toggle(CONTENT_LARGE, isContentLarge.value);
// }

// function handleContentFullClick() {
//   // Cancel content area enlargement
//   isContentLarge.value && handleContentLargeClick();
//   // Hide unnecessary components when content area is fullscreen
//   classList.add(CONTENT_FULL);
//   // Enter fullscreen
//   handleFullscreenClick();
// }
// #endregion
</script>

<template>
  <div />
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
