window.onload = function () {
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  mbr.stylesheet(styles, head);

  const FS = '/fs';
  const TYPE = {
    DIRECTORY: 'DIRECTORY',
    AUDIO: 'AUDIO'
  };

  var ifc = {};

  var get = {
    fs: mbr.ajax({
      url: FS,
      onresponse: function (response) {
        var data;

        if (this.state = this.STATE.SUCCESS) {
          data = JSON.parse(response);
          ifc.crumbs(data.path);

          if (data.type === TYPE.DIRECTORY) {
            ifc.list(data.content.sort(listSorter));
          }
        }
      }
    })
  };

  function listSorter (item1, item2) {
    if (item1.type === item2.type) {
      return item1.path > item2.path ? 1 : -1;
    }

    if (item1.type === TYPE.DIRECTORY) {
      return -1;
    }

    return 1;
  }

  ifc.go = function (path) {
    window.location.hash = '#' + path;
  }

  function getFilename (path) {
    if (path[path.length - 1] === '/') {
      path = path.substring(0, path.length - 1);
    }

    var slashPosition = path.lastIndexOf('/');

    return path.substring(slashPosition + 1);
  }

  function ListItem (info) {
    return mbr.dom('div', {
      className: 'list-item',
      innerText: getFilename(info.path),
      onclick: function () {
        switch (info.type) {
          case TYPE.AUDIO:
            ifc.player.load(info.path);
            break;
          case TYPE.DIRECTORY:
            ifc.go(info.path);
            break;
        }
      }
    });
  }

  function Crumb (name, link, short) {
    var crumb = mbr.dom('div', {
      className: 'crumbs-item'
    }).append(mbr.dom('div', {
      className: 'crumbs-item-content',
      innerText: name
    }));
    var crumbCN = crumb.cn();

    if (short) {
      crumbCN.add('short');
    }

    if (link) {
      crumbCN.add('active');
      crumb.dom.onclick = function () {
        ifc.go(link);
      }
    }

    return crumb;
  }

  function hashListener (event) {
    var hash = event.target.location.hash.substring(1);
    get.fs.set({ url: FS + hash }).send();
  }

  mbr.dom('div', { className: 'main' }).appendTo(body).append(
    mbr.dom('div', { className: 'crumbs' }, function (crumbs) {

      ifc.crumbs = function (path) {
        crumbs.clear();

        if (path === '/') {
          ifc.title('');
          crumbs.append(Crumb('/', null, true));
          return;
        }

        var splitted = path.split('/');
        var currentLink = '/';
        var stack = [];

        for (var index = 0 ; index < splitted.length ; ++index) {
          if (!splitted[index]) {
            continue;
          }

          currentLink += splitted[index] + '/';

          stack.push({
            link: currentLink,
            name: splitted[index]
          });
        }
        var counter = 4;
        var element = stack.pop();
        var last, current;

        ifc.title(element.name);

        crumbs.append(Crumb('/', '/', true));

        while (counter-- && (element = stack.pop())) {
          current = Crumb(element.name, element.link);

          if (last) {
            last.neighbor(current);
          } else {
            crumbs.append(current);
          }

          last = current;
        }

        if (counter < 0 && stack.length) {
          last.neighbor(Crumb(stack.length, null, true));
        }
      }
    }),
    mbr.dom('div', { className: 'crumbs-title' }, function (title) {
      ifc.title = function (text) { title.dom.innerText = text; }
    }),
    mbr.dom('div', { className: 'player' }, function (playerBlock) {
      var player = new Audio();
      var isPlaying = false;
      var cursor = 0;
      var playlist = [];
      var currentTrack;
      player.oncanplaythrough = function () {
        ifc.player.play();
      }
      player.onended = function () {
        if (isCurrent()) {
          ifc.player.next();
        } else {
          ifc.player.pause();
          cursor = 0;
        }
      }
      player.onloadedmetadata = function (event) {
        console.log(event, this);
      }

      function isCurrent () {
        return currentTrack === playlist[cursor];
      }

      function getIndex (path) {
        for (var index = 0 ; index < playlist.length ; ++index) {
          if (playlist[index] === path) {
            return index;
          }
        }

        return -1;
      }

      playerBlock.append(
        mbr.dom('div', { className: 'player-button skip-left', onclick: function () {ifc.player.prev()} }),
        // mbr.dom('div', { className: 'player-button seek-left' }),
        mbr.dom('div', { className: 'player-button play' }, function (play) {
          var playCN = play.cn();

          ifc.player = {
            list: function (list) {
              playlist = [];

              for (var index = 0 ; index < list.length ; ++index) {
                playlist.push(list[index].path);
              }

              console.log(cursor, playlist);
            },
            load: function (src) {
              cursor = getIndex(src);
              if (cursor < 0) {
                cursor = 0;
              }

              isPlaying = false;
              player.src = '/get/' + src;
              currentTrack = src;
            },
            next: function () {
              cursor++;

              if (!playlist[cursor]) {
                cursor = 0;
              }

              if (playlist[cursor]) {
                ifc.player.load(playlist[cursor]);
              }
            },
            prev: function () {
              cursor--;

              if (!playlist[cursor]) {
                cursor = playlist.length - 1;
              }

              if (playlist[cursor]) {
                ifc.player.load(playlist[cursor]);
              }
            },
            pause: function () {
              if (isPlaying) {
                player.pause();
                playCN.del('pause').add('play');
                isPlaying = false;
              }
            },
            play: function () {
              if (!isPlaying) {
                if (playlist[cursor]) {
                  if (isCurrent()) {
                    player.play();
                    isPlaying = true;
                    playCN.del('play').add('pause');
                    ifc.player.progress();
                  } else {
                    ifc.player.load(playlist[cursor]);
                  }
                } else {
                  cursor = 0;
                }
              }
            },
            toggle: function () {
              if (isPlaying) {
                ifc.player.pause();
              } else {
                ifc.player.play();
              }
            }
          };

          play.on({
            click: ifc.player.toggle
          });
        }),
        // mbr.dom('div', { className: 'player-button seek-right' }),
        mbr.dom('div', { className: 'player-button skip-right', onclick: function () {ifc.player.next()} }),
        mbr.dom('div', { className: 'player-progress' }, function (progress) {
          var frameTime;
          var bar = mbr.dom('div', { className: 'player-progress-bar' });

          function animationFrame (time) {
            if (time && (!frameTime || (time - frameTime) > 400)) {
              frameTime = time;
              var width = (player.currentTime / player.duration * 100);
              console.log(player.currentTime, player.duration, width);
              bar.dom.style.width = width + '%';
            }

            if (isPlaying) {
              window.requestAnimationFrame(animationFrame);
            }
          }

          ifc.player.progress = function () {
            animationFrame();
          }

          progress.append(bar);
        })
      );
    }),
    mbr.dom('div', { className: 'content' }, function (content) {
      var items = [];
      ifc.list = function (data) {
        var index;
        var playlist = [];

        for (index = 0 ; index < items.length ; ++index) {
          items[index].remove();
        }
        items = [];
        for (index = 0 ; index < data.length ; ++index) {
          if (data[index].type === TYPE.AUDIO) {
            playlist.push(data[index]);
          }
          items[index] = ListItem(data[index]);
          content.append(items[index]);
        }
        ifc.player.list(playlist);
      }
    })
  )

  window.addEventListener('hashchange', hashListener);
  hashListener({ target: window });
  // get.fs.send();
}
