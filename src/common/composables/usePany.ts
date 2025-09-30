function initStarNotification() {
  setTimeout(() => {
    ElNotification({
      title: 'Powered by Love!',
      type: 'success',
      message: h(
        'div',
        null,
        [
          h('div', null, 'All source code is open source for free. If it helps you, please give a Star to support!'),
          h('a', { style: 'color: teal', target: '_blank', href: 'https://github.com/anthon92/copilot-admin' }, 'Click to go')
        ]
      ),
      duration: 0,
      position: 'bottom-right'
    });
  }, 0);
}

function initStoreNotification() {
  setTimeout(() => {
    ElNotification({
      title: 'Lazy Service?',
      type: 'warning',
      message: h(
        'div',
        null,
        [
          h('div', null, 'Don\'t want to do it yourself, but want to remove TS or other modules? There are also lazy packages!'),
          h('a', { style: 'color: teal', target: '_blank', href: 'https://github.com/anthon92/copilot-admin' }, 'Click to get')
        ]
      ),
      duration: 0,
      position: 'bottom-right'
    });
  }, 500);
}

function initMobileNotification() {
  setTimeout(() => {
    ElNotification({
      title: 'Mobile',
      type: 'primary',
      message: h(
        'div',
        null,
        [
          h('div', null, 'If you have mobile H5 needs, try the new open source template MobVue!'),
          h('a', { style: 'color: teal', target: '_blank', href: 'https://github.com/anthon92/copilot-admin' }, 'Click to view')
        ]
      ),
      duration: 0,
      position: 'bottom-right'
    });
  }, 1000);
}

/** Author's little thoughts */
export function usePany() {
  return { initStarNotification, initStoreNotification, initMobileNotification };
}
