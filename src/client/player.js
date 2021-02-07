function Player () {
  var player = this;
  var frameTime;

  this.audio = new Audio();
  this.audio.autoplay = true;
  this.playlist = new Playlist();
  this.state = Player.STATE.IDLE;
  this.track = null;
  this.onStateChange = null;
  this.onProgress = null;
  this.onTrackChange = null;
  this.onDebug = null;
  this.progressDelay = 400;

  this.audio.oncanplay = function () {
    player.play();
  }
  this.audio.onended = function () {
    if (player.isCurrent()) {
      player.next();
    } else {
      player.pause();
      player.playlist.first();
    }
  }
  this.audio.ondurationchange = function () {
    (player.onTrackChange instanceof Function) && player.onTrackChange(player.track);
  }

  Player.session.actions({
    play: function () { player.play(); },
    pause: function () { player.pause() },
    nexttrack: function () { player.next() },
    previoustrack: function () { player.prev() }
  });

  this.animationFrame = function (time) {
    if (
      player.onProgress instanceof Function
      && time
      && (!frameTime || (time - frameTime) > player.progressDelay)
    ) {
      frameTime = time;
      player.onProgress(player.audio.currentTime, player.audio.duration);
    }

    if (player.state === Player.STATE.PLAYING) {
      window.requestAnimationFrame(player.animationFrame);
    }
  }
}
Player.prototype.debug = function (message) {
  (this.onDebug instanceof Function) && this.onDebug(message);
}
Player.prototype.setTrack = function (track) {
  if (this.track === track) {
    return;
  }

  this.track && this.track.cn.del('current');
  this.track = track;
  this.track.cn.add('current');
  (this.onTrackChange instanceof Function) && this.onTrackChange(this.track);
  Player.session.meta({ title: this.track.title });
}
Player.prototype.setState = function (state) {
  if (state === this.state) {
    return;
  }

  if (this.onStateChange instanceof Function) {
    this.onStateChange(state, this.state);
  }

  this.state = state;
}
Player.prototype.isCurrent = function () {
  return this.track
    ? this.playlist.isCurrent(this.track.url)
    : false;
}
Player.prototype.load = function (src) {
  this.setTrack(this.playlist.setTrack(src));

  if (this.track) {
    this.setState(Player.STATE.FETCHING);
    this.audio.src = '/get/' + src;
  }
}
Player.prototype.next = function () {
  var next = this.playlist.next();

  if (next) {
    this.load(next.url);
  }
}
Player.prototype.prev = function () {
  var prev = this.playlist.prev();

  if (prev) {
    this.load(prev.url);
  }
}
Player.prototype.pause = function () {
  if (this.state === Player.STATE.PLAYING) {
    this.audio.pause();
    this.setState(Player.STATE.IDLE);
    Player.session.state('paused');
  }
}
Player.prototype.play = function () {
  if (this.state !== Player.STATE.PLAYING) {
    var current = this.playlist.getCurrent();

    if (current) {
      if (this.isCurrent()) {
        this.audio.play();
        this.setState(Player.STATE.PLAYING);
        this.animationFrame();
        Player.session.state('playing');
      } else {
        this.load(current.url);
      }
    } else {
      this.playlist.first();
    }
  }
}
Player.prototype.seek = function (progress) {
  this.audio.currentTime = this.audio.duration * progress;
}
Player.session = {
  meta: function (data) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata(data);
    } catch (error) {
      console.warn('MediaSession error');
      console.warn(error);
    }
  },
  actions: function (actions) {
    try {
      for (var name in actions) {
        navigator.mediaSession.setActionHandler(name, actions[name]);
      }
    } catch (error) {
      console.warn('MediaSession error');
      console.warn(error);
    }
  },
  state: function (state) {
    try {
      navigator.mediaSession.playbackState = state;
    } catch (error) {
      console.warn('MediaSession error');
      console.warn(error);
    }
  }
}

Player.STATE = {
  PLAYING: 'PLAYING',
  IDLE: 'IDLE',
  FEtCHING: 'FETCHING'
};
