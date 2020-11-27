function MAudio () {
  this.context = new AudioContext();
  this.source = this.context.createBufferSource();
  this.src = null;
}

MAudio.prototype.load = function (src) {
  this.src = src;

  var audio = this;
  var request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    audio.context.decodeAudioData(request.response, function (data) {
      audio.source = data.buffer;
      audio.source.connect(audio.context.destination);
      audio.onloaded && audio.onloaded(data);
    });
  }
  request.send();
}
