const fs = require('fs');
const config = require('./config.js');

const TYPE = {
  DIRECTORY: 'DIRECTORY',
  FILE: 'FILE',
  ERROR: 'ERROR',
  AUDIO: 'AUDIO',
  PLAYLIST: 'PLAYLIST',
  UNSUPPORTED: 'UNSUPPORTED'
};

const FORMAT = {
  mp3: TYPE.AUDIO,
  ogg: TYPE.AUDIO,
  aac: TYPE.AUDIO,
  wav: TYPE.AUDIO,

  pls: TYPE.PLAYLIST
}

const ROOT = config.root;

const RE = {
  RANGE_HEADER: /^(bytes)=(\d+)-(\d+)$/,
};

function getFileType(path) {
  const extension = getExtension(path);

  return FORMAT[extension] || TYPE.UNSUPPORTED
}

function sendFile(request, resource) {
  if (resource) {
    const [path, ext] = resource;

    fs.readFile(path, function (error, data) {
      if (error) {
        request.status = 404;
        request.send(JSON.stringify(error), 'json');
      } else {
        request.send(data, ext);
      }
    });
  } else {
    request.status = 404;
    request.send('<html><body>Resource doesn\'t exist</body></html>', 'htm');
  }
}

function parsePath(path) {
  const pathSplitted = path.split('/');
  let result = [];

  for (let index = 0 ; index < pathSplitted.length ; ++index) {
    switch (pathSplitted[index]) {
      case '..':
        if (result.length) {
          result.pop();
        } else {
          return '';
        }
        break;
      case '.':
      case '':
        break;
      default:
        result.push(decodeURIComponent(pathSplitted[index]));
        break;
    }
  }

  return '/' + result.join('/');
}

function getFileData(path, stats) {
  return {
    type: getFileType(path),
    path: path,
    size: stats.size,
    atime: stats.atimeMs,
    mtime: stats.mtimeMs,
    ctime: stats.ctimeMs
  };
}

function getDirectoryData(path) {
  return {
    type: TYPE.DIRECTORY,
    path: (path === '/') ? path : (path + '/')
  };
}

function getDirectory(path, callback) {
  const result = getDirectoryData(path);

  let content = result.content = [];

  fs.readdir(ROOT + path, function (error, files) {
    if (error) {
      callback(error);
    } else {
      let counter = files.length;

      if (counter) {
        for (let index = 0 ; index < files.length ; ++index) {
          let pathName = path + (path === '/' ? '' : '/') + files[index];

          fs.stat(ROOT + pathName, function (error, stats) {
            if (error) {
              content.push({
                path: pathName,
                type: TYPE.ERROR
              });
            } else {
              if (stats.isDirectory()) {
                content.push(getDirectoryData(pathName));
              } else {
                content.push(getFileData(pathName, stats));
              }
            }
            if (!--counter) {
              callback(null, result);
            }
          });
        }
      } else {
        callback(null, result);
      }
    }
  });
}

function getFSData (path, callback) {
  parsedPath = parsePath(path);

  if (parsedPath) {
    fs.stat(ROOT + parsedPath, function (error, stats) {
      if (error) {
        callback(error);
      } else {
        if (stats.isDirectory()) {
          getDirectory(parsedPath, callback);
        } else {
          callback(null, getFileData(parsedPath, stats));
        }
      }
    });
  } else {
    callback(new Error('Invalid path: ' + path));
  }
}

function getFSContent(path, callback) {
  parsedPath = parsePath(path);

  if (parsedPath) {
    fs.readFile(ROOT + parsedPath, callback);
  }
}

function getExtension(path) {
  const dotPosition = path.lastIndexOf('.');

  if (dotPosition === -1) {
    return '';
  }

  return path.substring(dotPosition + 1);
}

function getFilename (path) {
  const slashPos = path.lastIndexOf('/');

  return path.substring(slashPos + 1);
}
function getRange(request, data) {
  const range = RE.RANGE_HEADER.exec(request.request.headers.range);

  if (!range) {
    return null;
  }

  const start = parseInt(range[2], 10);
  const stop = parseInt(range[3], 10) + 1;

  const result = data.slice(start, stop);

  request.status = 206;
  request.headers['Content-Range'] = 'bytes ' + start + '-' + stop + '/' + data.length;
  request.headers['Content-Length'] = result.length;

  return result;
}

module.exports = {
  sendFile,
  getFSData,
  getExtension,
  getFilename,
  getFSContent,
  getRange
};
