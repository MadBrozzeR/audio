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
    var hash = event.target.location.hash.substring(1) || '/';
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
            last.neighbour(current);
          } else {
            crumbs.append(current);
          }

          last = current;
        }

        if (counter < 0 && stack.length) {
          last.neighbour(Crumb(stack.length, null, true));
        }
      }
    }),
    mbr.dom('div', { className: 'crumbs-title' }, function (title) {
      ifc.title = function (text) { title.dom.innerText = text; }
    }),
    mbr.dom('div', { className: 'player' }, function (playerBlock) {
      var player = new Audio();
      var playlist = new Playlist();
      var isPlaying = false;
      var currentState = 'play';
      var currentTrack = {
        track: null,
        set: function (track) {
          this.track && this.track.cn.del('current');
          this.track = track;
          this.track.cn.add('current');
        }
      };
      player.oncanplaythrough = function () {
        ifc.player.play();
      }
      player.onended = function () {
        if (isCurrent()) {
          ifc.player.next();
        } else {
          ifc.player.pause();
          playlist.first();
        }
      }
      /*
      player.onloadedmetadata = function (event) {
        console.log(event, this);
      }
      */

      function isCurrent () {
        return currentTrack.track
          ? playlist.isCurrent(currentTrack.track.url)
          : false;
      }

      playerBlock.append(
        mbr.dom('div', { className: 'player-button skip-left', onclick: function () {ifc.player.prev()} }),
        mbr.dom('div', { className: 'player-button' }, function (play) {
          var playCN = play.cn().add(currentState);

          function setPlayState (state) {
            playCN.del(currentState).add(currentState = state);
          };

          ifc.playlist = {
            clear: function () {
              playlist.init();
            },
            add: function (info, element) {
              var track = playlist.add(info.path, element.cn());

              if (!currentTrack.track || track.url === currentTrack.track.url) {
                currentTrack.set(track);
              }
            }
          };
          ifc.player = {
            load: function (src) {
              if (!isCurrent()) {
                currentTrack.set(playlist.setTrack(src));
              }
              if (currentTrack.track) {
                isPlaying = false;
                setPlayState('fetching');
                player.src = '/get/' + src;
              }
            },
            next: function () {
              var next = playlist.next();

              if (next) {
                ifc.player.load(next.url);
              }
            },
            prev: function () {
              var prev = playlist.prev();

              if (prev) {
                ifc.player.load(prev.url);
              }
            },
            pause: function () {
              if (isPlaying) {
                player.pause();
                setPlayState('play');
                isPlaying = false;
              }
            },
            play: function () {
              if (!isPlaying) {
                var current = playlist.getCurrent();

                if (current) {
                  if (isCurrent()) {
                    player.play();
                    isPlaying = true;
                    setPlayState('pause');
                    ifc.player.progress();
                  } else {
                    ifc.player.load(current.url);
                  }
                } else {
                  playlist.first();
                }
              }
            },
            toggle: function () {
              if (isPlaying) {
                ifc.player.pause();
              } else {
                ifc.player.play();
              }
            },
            seek: function (progress) {
              player.currentTime = player.duration * progress;
            }
          };

          play.on({
            click: ifc.player.toggle
          });
        }),
        mbr.dom('div', { className: 'player-button skip-right', onclick: function () {ifc.player.next()} }),

        mbr.dom('div', { className: 'player-progress' }, function (progress) {
          var frameTime;
          var bar = mbr.dom('div', { className: 'player-progress-bar' });

          function animationFrame (time) {
            if (time && (!frameTime || (time - frameTime) > 400)) {
              frameTime = time;
              var width = (player.currentTime / player.duration * 100);
              bar.dom.style.width = width + '%';
            }

            if (isPlaying) {
              window.requestAnimationFrame(animationFrame);
            }
          }

          progress.dom.onclick = function (event) {
            ifc.player.seek(event.offsetX / progress.dom.clientWidth);
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
        ifc.playlist.clear();

        for (index = 0 ; index < items.length ; ++index) {
          items[index].remove();
        }
        items = [];
        for (index = 0 ; index < data.length ; ++index) {
          items[index] = ListItem(data[index]);
          if (data[index].type === TYPE.AUDIO) {
            ifc.playlist.add(data[index], items[index]);
          }
          content.append(items[index]);
        }
      }
    })
  )

  window.addEventListener('hashchange', hashListener);
  hashListener({ target: window });
  // get.fs.send();
}
