/**
 * 忽略编译
 */
var loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');

module.exports = function(content) {
  // console.log(content);
  // this.cacheable(false);
  // var callback = this.async();

  // var headerPath = path.join(__dirname, 'header.js');
  // fs.readFile(headerPath, 'utf-8', function(err, header) {
  //   if (err) return callback(err);
  //   callback(null, header + '\n' + source);
  // });
  return content;
};

module.exports.pitch = function() {
  const options = loaderUtils.getOptions(this) || {};
  if (global.abc) {
    return true;
  }
};

module.exports.raw = true;
