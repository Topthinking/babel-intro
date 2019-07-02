module.exports = function(content) {
  this.emitFile('./a.jpg', content);
  return `module.exports = 'a.jpg'`;
};

module.exports.raw = true;
