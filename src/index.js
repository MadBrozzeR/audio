const {
  sendFile,
  getFSData,
  getExtension,
  getFSContent
} = require('./utils.js');

const SCRIPTS = {
  DOM: '/../node_modules/mbr-dom/dom.js',
  AJAX: '/../node_modules/mbr-ajax/index.js',
  STYLE: '/../node_modules/mbr-style/index.js'
}

const TEMPLATE = {
  MAIN: {
    title: 'audio',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      minimumScale: 1,
      maximumScale: 1,
      scalable: false
    },
    scripts: ['mbr-dom', 'mbr-style', 'mbr-ajax', 'main', 'styles']
  },
  PAGE404: {
    title: 'Not found',
    body: '<body>Page not found</body>'
  }
}

const RE = {
  FS: /^\/fs\/(.*)$/,
  DATA: /^\/get\/(.*)$/
};

function getIndex() {
  this.send(this.template(TEMPLATE.MAIN), 'htm');
}

function getFavicon() {
  this.send('', 'ico');
}

function getMBRDom() {
  sendFile(this, __dirname + SCRIPTS.DOM, 'js');
}

function getMBRStyle() {
  sendFile(this, __dirname + SCRIPTS.STYLE, 'js');
}

function getMBRAjax() {
  sendFile(this, __dirname + SCRIPTS.AJAX, 'js');
}

function getMain() {
  sendFile(this, __dirname + '/main.js', 'js');
}

function getStyles() {
  sendFile(this, __dirname + '/styles.js', 'js');
}

function get404() {
  this.status = 404;
  this.send(this.template(TEMPLATE.PAGE404), 'htm');
}

function getFS(regMatch) {
  const request = this;

  getFSData(regMatch[1], function (error, data) {
    if (error) {
      request.status = 404;
      request.send(JSON.stringify(error), 'json');
    } else {
      request.send(JSON.stringify(data), 'json');
    }
  });
}

function getData(regMatch) {
  const request = this;
  const path = regMatch[1];

  getFSContent(path, function (error, data) {
    if (error) {
      request.status = 404;
      request.send(JSON.stringify(error), 'json');
    } else {
      request.headers['Accept-Ranges'] = 'bytes';
      request.send(data, getExtension(path));
    }
  });
}

const router = {
  '/': getIndex,
  '/favicon.ico': getFavicon,
  '/mbr-dom': getMBRDom,
  '/mbr-style': getMBRStyle,
  '/mbr-ajax': getMBRAjax,
  '/main': getMain,
  '/styles': getStyles,

  default: get404
};

module.exports = function (request) {
  request.match(RE.FS, getFS)
    || request.match(RE.DATA, getData)
    || request.route(router);
}
