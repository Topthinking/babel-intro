/**
 * 忽略编译
 */
var loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');

module.exports = function(content) {
  console.log(1, content);
  this.cacheable(false);
  // var callback = this.async();
  // var headerPath = path.join(__dirname, 'header.js');

  // this.addDependency(headerPath);

  // fs.readFile(headerPath, 'utf-8', function(err, header) {
  //   if (err) return callback(err);
  //   console.log(header);
  //   callback(content);
  //   // callback(null, header + '\n' + source);
  // });
  this.data = { content };
  return content;
};

module.exports.pitch = function(content) {
  console.log(-1, content, this.data);
  const options = loaderUtils.getOptions(this) || {};
  if (global.abc) {
    return 123;
  }
};

module.exports.raw = true;
