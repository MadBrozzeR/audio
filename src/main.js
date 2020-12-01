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
      className: 'list-item ' + info.type,
      innerText: getFilename(info.path),
      onclick: function () {
        switch (info.type) {
          case TYPE.AUDIO:
            ifc.player.start(info.path);
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

        ifc.title(element.name);

        var root = Crumb('/', '/', true);
        crumbs.append(root);

        while (counter-- && (element = stack.pop())) {
          root.neighbour(null, Crumb(element.name, element.link));
        }

        if (counter < 0 && stack.length) {
          root.neighbour(null, Crumb(stack.length, null, true));
        }
      }
    }),
    mbr.dom('div', { className: 'crumbs-title' }, function (title) {
      ifc.title = function (text) { title.dom.innerText = text; }
    }),
    mbr.dom('div', { className: 'player' }, function (playerBlock) {
      var player = new Player();

      playerBlock.append(
        mbr.dom('div', {
          className: 'player-button skip-left',
          onclick: function () {player.prev()}
        }, function (left) {
          left.dom.appendChild(Svg.SkipLeft());
        }),
        mbr.dom('div', { className: 'player-button' }, function (play) {
          var STATE_MAP = {};
          STATE_MAP[Player.STATE.IDLE] = 'play';
          STATE_MAP[Player.STATE.PLAYING] = 'pause';
          STATE_MAP[Player.STATE.FETCHING] = 'fetching';

          var playCN = play.cn().add(STATE_MAP[player.state]);

          player.onStateChange = function (state, oldState) {
            playCN.del(STATE_MAP[oldState]).add(STATE_MAP[state]);
          }

          ifc.playlist = {
            clear: function () {
              player.playlist.init();
            },
            add: function (info, element) {
              var track = player.playlist.add(info.path, element.cn());

              if (player.track && track.url === player.track.url) {
                player.setTrack(track);
                player.playlist.setTrack(track.url);
              }
            }
          };
          ifc.player = {
            start: function (src) {
              if (!player.playlist.isCurrent(src)) {
                player.load(src);
              }
            }
          };

          play.on({
            click: function () {
              if (player.state === Player.STATE.PLAYING) {
                player.pause();
              } else if (player.state === Player.STATE.IDLE) {
                player.play();
              }
            }
          });

          play.dom.appendChild(Svg.Play());
          play.dom.appendChild(Svg.Pause());
          play.dom.appendChild(Svg.Fetch());
        }),
        mbr.dom('div', {
          className: 'player-button skip-right',
          onclick: function () {player.next()}
        }, function (right) {
          right.dom.appendChild(Svg.SkipRight());
        }),

        mbr.dom('div', { className: 'player-progress' }, function (progress) {
          var bar = mbr.dom('div', { className: 'player-progress-bar' });

          player.onProgress = function (time, duration) {
            var width = (time / duration * 100);
            bar.dom.style.width = width + '%';
          }
          progress.dom.onclick = function (event) {
            player.seek(event.offsetX / progress.dom.clientWidth);
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
