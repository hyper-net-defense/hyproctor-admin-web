import type { Handler } from 'mitt';
import type { RouteLocationNormalizedGeneric } from 'vue-router';
import mitt from 'mitt';

/** Callback function type */
type Callback = (route: RouteLocationNormalizedGeneric) => void;

const emitter = mitt();

const key = Symbol('ROUTE_CHANGE');

let latestRoute: RouteLocationNormalizedGeneric;

/** Set the latest route information and trigger route change event */
export function setRouteChange(to: RouteLocationNormalizedGeneric) {
  // Trigger event
  emitter.emit(key, to);
  // Cache the latest route information
  latestRoute = to;
}

/**
 * @name Subscribe to route change Composable
 * @description 1. Using watch alone to listen to routes wastes rendering performance
 * @description 2. Prefer using this publish-subscribe pattern for management
 */
export function useRouteListener() {
  // Callback function collection
  const callbackList: Callback[] = [];

  // Listen to route changes (can choose to execute immediately)
  const listenerRouteChange = (callback: Callback, immediate = false) => {
    // Cache callback function
    callbackList.push(callback);
    // Listen to event
    emitter.on(key, callback as Handler);
    // Can choose to execute callback immediately once
    immediate && latestRoute && callback(latestRoute);
  };

  // Remove route change event listener
  const removeRouteListener = (callback: Callback) => {
    emitter.off(key, callback as Handler);
  };

  // Remove listener before component is unmounted
  onBeforeUnmount(() => {
    callbackList.forEach(removeRouteListener);
  });

  return { listenerRouteChange, removeRouteListener };
}
