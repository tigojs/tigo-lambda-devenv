const errorWrapper = (server) => {
  server.context.onerror = function (err) {
    this.set('Content-Type', 'application/json');
    this.body = JSON.stringify({
      success: false,
      message: err.message || 'Unknown error.',
      stack: err.stack,
    }, null, '  ');
  };
};

module.exports = errorWrapper;
