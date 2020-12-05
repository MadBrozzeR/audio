function Playlist() {
  this.init();
}
Playlist.prototype.add = function (url, cn) {
  var slashPos = url.lastIndexOf('/');
  var dotPos = url.lastIndexOf('.');
  if (dotPos === -1) {
    dotPos = url.length;
  }

  var item = {
    title: url.substring(slashPos + 1, dotPos),
    url: url,
    cn: cn
  };

  this.list.push(item);

  return item;
}
Playlist.prototype.init = function () {
  this.list = [];
  this.current = 0;
}
Playlist.prototype.isCurrent = function (url) {
  var current = this.list[this.current];
  return current ? current.url === url : false;
}
Playlist.prototype.getIndex = function (url) {
  for (var index = 0 ; index < this.list.length ; ++index) {
    if (this.list[index].url === url) {
      return index;
    }
  }

  return -1;
}
Playlist.prototype.setTrack = function (url) {
  var index = this.getIndex(url);

  this.current = index < 0 ? 0 : index;

  return this.getCurrent();
}
Playlist.prototype.next = function () {
  var next = this.list[this.current + 1];

  if (next) {
    ++this.current;

    return next;
  }

  return null;
}
Playlist.prototype.prev = function () {
  var prev = this.list[this.current - 1];

  if (prev) {
    --this.current;

    return prev;
  }

  return null;
}
Playlist.prototype.getCurrent = function () {
  return this.list[this.current] || null;
}
Playlist.prototype.first = function () {
  this.current = 0;

  return this.getCurrent();
}
