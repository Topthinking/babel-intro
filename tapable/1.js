// SyncHook 钩子的使用
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
} = require('tapable');

const Sync = SyncLoopHook;

// 创建实例
let sync = new Sync(['name', 'age']);

// 注册事件
sync.tap('1', (name, age) => console.log('1', name, age));
sync.tap('2', (name, age) => {
  console.log('2', name, age);
  return undefined;
});
sync.tap('3', (name, age) => console.log('3', name, age));

// 触发事件，让监听函数执行
sync.call('panda', 18);
