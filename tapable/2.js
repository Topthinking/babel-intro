// AsyncParallelHook 钩子：tapAsync/callAsync 的使用
const { AsyncParallelHook } = require('tapable');

// 创建实例
let asyncParallelHook = new AsyncParallelHook(['name', 'age']);

// 注册事件
console.time('time');
asyncParallelHook.tapAsync('1', (name, age, done) => {
  setTimeout(() => {
    console.log('1', name, age, new Date());
    done();
  }, 1000);
});

asyncParallelHook.tapAsync('2', (name, age, done) => {
  setTimeout(() => {
    console.log('2', name, age, new Date());
    done();
  }, 2000);
});

asyncParallelHook.tapAsync('3', (name, age, done) => {
  setTimeout(() => {
    console.log('3', name, age, new Date());
    done();
    console.timeEnd('time');
  }, 3000);
});

// 触发事件，让监听函数执行
asyncParallelHook.callAsync('panda', 18, () => {
  console.log('complete');
});

// 1 panda 18 2018-08-07T10:38:32.675Z
// 2 panda 18 2018-08-07T10:38:33.674Z
// 3 panda 18 2018-08-07T10:38:34.674Z
// complete
// time: 3005.060ms
