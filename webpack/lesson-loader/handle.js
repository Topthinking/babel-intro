module.exports = function(url) {
  if (typeof window === 'undefined') {
    // 服务端，说明提取资源到css中了
    return 'anc' + url;
  } else {
    // 客户端，在当域下执行
    return './' + url;
  }
};
