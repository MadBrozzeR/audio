function Player () {
  var player = this;
  var frameTime;

  this.audio = new Audio();
  this.playlist = new Playlist();
  this.state = Player.STATE.IDLE;
  this.track = null;
  this.onStateChange = null;
  this.onProgress = null;
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
Player.prototype.setTrack = function (track) {
  if (this.track === track) {
    return;
  }

  this.track && this.track.cn.del('current');
  this.track = track;
  this.track.cn.add('current');
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

Player.STATE = {
  PLAYING: 'PLAYING',
  IDLE: 'IDLE',
  FEtCHING: 'FETCHING'
};
