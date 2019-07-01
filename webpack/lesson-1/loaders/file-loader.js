module.exports = function(content) {
  console.log(2);
  this.emitFile('./a.jpg', content);
  return `module.exports = 'a.jpg'`;
};

module.exports.raw = true;
