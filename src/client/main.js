window.onload = function () {
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  mbr.stylesheet(styles, head);

  var FS = '/fs';
  var GET = '/get';
  var TYPE = {
    DIRECTORY: 'DIRECTORY',
    AUDIO: 'AUDIO'
  };

  var ifc = {};

  var get = {
    fs: mbr.ajax({
      url: FS,
      onrequest: function () {
        ifc.fs.showCurtain();
      },
      onresponse: function (response) {
        var data;

        ifc.fs.hideCurtain();
        if (this.state === this.STATE.SUCCESS) {
          data = JSON.parse(response);
          ifc.crumbs(data.path);

          switch (data.type) {
            case TYPE.DIRECTORY:
              ifc.fs.list(data.content.sort(listSorter));
              break;
            case TYPE.AUDIO:
              ifc.fs.list([data]);
              break;
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

  function formatTime (time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);

    return (minutes < 10 ? ('0' + minutes) : minutes) +
      ':' +
      (seconds < 10 ? ('0' + seconds) : seconds);
  }

  var SIZE = {};
  SIZE.K = 1024;
  SIZE.M = SIZE.K * 1024;
  SIZE.G = SIZE.M * 1024;

  function formatSize (size) {
    if (size > SIZE.G) {
      return Math.round(size / SIZE.G * 100) / 100 + ' G';
    }
    if (size > SIZE.M) {
      return Math.round(size / SIZE.M * 100) / 100 + ' M';
    }
    if (size > SIZE.K) {
      return Math.round(size / SIZE.K * 100) / 100 + ' K';
    }
    return size;
  }

  function ListItem (info, onCNSwitch) {
    switch (info.type) {
      case TYPE.DIRECTORY:
        return mbr.dom('div', {
          className: 'list-item ' + info.type,
          innerText: getFilename(info.path),
          onclick: function () {
            ifc.go(info.path);
          }
        });
      case TYPE.AUDIO:
        return mbr.dom('div', {
          className: 'list-item ' + info.type
        }, function (listItem) {
          var fileName = getFilename(info.path);
          var controlCN;

          listItem.append(
            mbr.dom('div', {
              className: 'list-item-name',
              innerText: fileName,
              onclick: function () {
                onCNSwitch(controlCN)
                controlCN.add('active');
              }
            }),
            mbr.dom('div', {
              className: 'list-item-size',
              innerText: formatSize(info.size)
            }),
            control = mbr.dom('div', {
              className: 'list-item-control'
            }, function (control) {
              controlCN = control.cn();

              control.dom.appendChild(
                Svg.Play(function () {
                  ifc.player.start(info.path);
                })
              );
              control.append(mbr.dom('div', {
                innerText: fileName,
                className: 'list-item-name',
                onclick: function () {
                  controlCN.del('active');
                }
              }));
              control.dom.appendChild(
                Svg.GoTo(function () {
                  ifc.go(info.path);
                })
              );
              control.dom.appendChild(
                Svg.Download(function () {
                  window.location.href = GET + info.path;
                })
              );
            })
          );
        });
      default:
        return mbr.dom('div', {
          className: 'list-item ' + info.type,
          innerText: getFilename(info.path)
        });
    }
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
      player.onDebug = function (message) {ifc.notify(message)};

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

          function togglePlay() {
            if (player.state === Player.STATE.PLAYING) {
              player.pause();
            } else if (player.state === Player.STATE.IDLE) {
              player.play();
            }
          }

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
              if (player.playlist.isCurrent(src)) {
                togglePlay();
              } else {
                player.load(src);
              }
            }
          };

          play.on({click: togglePlay});

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
          var trackBlock = mbr.dom('div', { className: 'player-track' });
          var positionBlock = mbr.dom('div', { className: 'player-position' });
          var durationBlock = mbr.dom('div', { className: 'player-duration' });

          player.onProgress = function (time, duration) {
            var width = (time / duration * 100);
            bar.dom.style.width = width + '%';
            positionBlock.dom.innerText = formatTime(time);
          }
          progress.dom.onclick = function (event) {
            player.seek(event.offsetX / progress.dom.clientWidth);
          }

          progress.append(bar, trackBlock, positionBlock, durationBlock);

          player.onTrackChange = function (track) {
            trackBlock.dom.innerText = track.title;
            durationBlock.dom.innerText = this.audio.duration ? formatTime(this.audio.duration) : '?';
            positionBlock.dom.innerText = '0';
            bar.dom.style.width = 0;
          }
        })
      );
    }),
    mbr.dom('div', { className: 'content' }, function (content) {
      var curtain = mbr.dom('div', { className: 'curtain' });
      var curtainCN = curtain.cn();
      var list = mbr.dom('div', { className: 'content-list' });
      var items = [];
      var lastControlCN;

      function handleCNSwitcher(controlCN) {
        if (lastControlCN) {
          lastControlCN.del('active');
        }

        lastControlCN = controlCN;
      }

      content.append(curtain, list);
      ifc.fs = {
        showCurtain: function () {
          curtainCN.add('active');
        },
        hideCurtain: function () {
          curtainCN.del('active');
        },
        list: function (data) {
          var index;
          ifc.playlist.clear();

          for (index = 0 ; index < items.length ; ++index) {
            items[index].remove();
          }
          items = [];
          for (index = 0 ; index < data.length ; ++index) {
            items[index] = ListItem(data[index], handleCNSwitcher);
            if (data[index].type === TYPE.AUDIO) {
              ifc.playlist.add(data[index], items[index]);
            }
            list.append(items[index]);
          }
        }
      };
    }),

    mbr.dom('div', { className: 'notification-manager' }, function (manager) {
      ifc.notify = function (message) {
        var notification = mbr.dom('div', { className: 'notification', innerText: message });
        manager.append(notification);
        setTimeout(function () { notification.remove() }, 5000);
      };
    })
  )

  window.addEventListener('hashchange', hashListener);
  hashListener({ target: window });
}
