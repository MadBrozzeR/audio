const {
  sendFile,
  getFSData,
  getExtension,
  getFilename,
  getFSContent,
  getRange
} = require('./utils.js');

const PROJECT_ROOT = __dirname + '/../../';
const CLIENT_ROOT = PROJECT_ROOT + 'src/client/';

const RESOURCES = {
  '/mbr-dom': [PROJECT_ROOT + 'node_modules/mbr-dom/dom.js', 'js'],
  '/mbr-ajax': [PROJECT_ROOT + 'node_modules/mbr-ajax/index.js', 'js'],
  '/mbr-style': [PROJECT_ROOT + 'node_modules/mbr-style/index.js', 'js'],
  '/main': [CLIENT_ROOT + 'main.js', 'js'],
  '/styles': [CLIENT_ROOT + 'styles.js', 'js'],
  '/playlist': [CLIENT_ROOT + 'playlist.js', 'js'],
  '/player': [CLIENT_ROOT + 'player.js', 'js'],
  '/svg': [CLIENT_ROOT + 'svg.js', 'js']
};
const RESOURCE_KEYS = Object.keys(RESOURCES);

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
    scripts: RESOURCE_KEYS
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

function getResource() {
  const resource = RESOURCES[this.getPath()];
  sendFile(this, resource);
}
getResource.ROUTES = RESOURCE_KEYS.reduce(function (result, name) {
  result[name] = getResource;

  return result;
}, {});

function get404() {
  this.status = 404;
  this.send(this.template(TEMPLATE.PAGE404), 'htm');
}

function fsRoute(regMatch) {
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

function dataRoute(regMatch) {
  const request = this;
  const path = regMatch[1];

  getFSContent(path, function (error, data) {
    if (error) {
      request.status = 404;
      request.send(JSON.stringify(error), 'json');
    } else {
      const range = getRange(request, data);
      request.headers['Accept-Ranges'] = 'bytes';
      request.headers['Content-Disposition'] = 'attachment; filename=' + getFilename(path);
      if (range) {
        request.send(range, getExtension(path));
      } else {
        request.send(data, getExtension(path));
      }
    }
  });
}

const router = {
  '/': getIndex,
  '/favicon.ico': getFavicon,
  ...getResource.ROUTES,

  default: get404
};

module.exports = function (request) {
  request.match(RE.FS, fsRoute)
    || request.match(RE.DATA, dataRoute)
    || request.route(router);
}
