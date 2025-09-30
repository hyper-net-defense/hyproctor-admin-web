import type { NotifyItem } from './type';

export const notifyData: NotifyItem[] = [
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: 'V3 Admin Vite is online',
    datetime: 'Two years ago',
    description: 'A free and open-source basic solution for mid-backend management systems, based on Vue3, TypeScript, Element Plus, Pinia, and Vite, among other mainstream technologies.'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: 'V3 Admin is online',
    datetime: 'Three years ago',
    description: 'A basic solution for mid-backend management systems, based on Vue3, TypeScript, Element Plus, and Pinia.'
  }
];

export const messageData: NotifyItem[] = [
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'From The Truman Show',
    description: 'If I never see you again, good morning, good afternoon, and good night.',
    datetime: '1998-06-05'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'From A Chinese Odyssey',
    description: 'If I have to add a time limit to this love, I hope it is ten thousand years.',
    datetime: '1995-02-04'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'From My Neighbor Totoro',
    description: 'With kindness in your heart, you will surely meet angels on your journey.',
    datetime: '1988-04-16'
  }
];

export const todoData: NotifyItem[] = [
  {
    title: 'Task Name',
    description: 'This guy is lazy, nothing left behind.',
    extra: 'Not started',
    status: 'info'
  },
  {
    title: 'Task Name',
    description: 'This guy is lazy, nothing left behind.',
    extra: 'In progress',
    status: 'primary'
  },
  {
    title: 'Task Name',
    description: 'This guy is lazy, nothing left behind.',
    extra: 'Overdue',
    status: 'danger'
  }
];
