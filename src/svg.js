var Svg = {
  namespace: 'http://www.w3.org/2000/svg',

  Element: function (name, props, callback) {
    var element = document.createElementNS(Svg.namespace, name);

    for (var prop in props) {
      element.setAttribute(prop, props[prop])
    }

    callback instanceof Function && callback(element);

    return element;
  },

  Points: function () {
    var result = '';

    for (var index = 0 ; index < arguments.length ; ++index) {
      if (arguments[index] instanceof Array) {
        result +=
          (result ? ' ' : '') +
          (arguments[index][0] || 0) +
          ',' +
          (arguments[index][1] || 0)
      }
    }

    return result;
  },

  Root: function (size, props, callback) {
    var args = {
      viewBox: '0 0 ' + size + ' ' + size,
      width: size,
      height: size,
      fill: 'black',
      stroke: 'none'
    };

    if (props instanceof Object) for (var prop in props) {
      args[prop] = props[prop];
    }

    return Svg.Element('svg', args, callback);
  },

  Play: function () {
    var size = 32;

    return Svg.Root(size, { 'class': 'play-svg' }, function (svg) {
      svg.appendChild(Svg.Element('polygon', {
        points: Svg.Points([0, 0], [0, size], [size, size / 2])
      }));
    });
  },

  Pause: function () {
    var size = 32;

    return Svg.Root(size, { 'class': 'pause-svg' }, function (svg) {
      svg.appendChild(Svg.Element('rect', {
        x: 0,
        y: 0,
        width: size * 0.35,
        height: size
      }));
      svg.appendChild(Svg.Element('rect', {
        x: size * 0.65,
        y: 0,
        width: size * 0.4,
        height: size
      }));
    });
  },

  Fetch: function () {
    var size = 32;

    return Svg.Root(size, { 'class': 'fetch-svg' }, function (svg) {
      svg.appendChild(Svg.Element('circle', {
        cx: '50%',
        cy: '50%',
        r: '50%'
      }));
    });
  },

  SkipLeft: function () {
    var size = 32;

    return Svg.Root(size, null, function (svg) {
      svg.appendChild(Svg.Element('rect', {
        x: 0,
        y: 0,
        width: size * 0.3,
        height: size
      }));

      svg.appendChild(Svg.Element('polygon', {
        points: Svg.Points([size, 0], [size, size], [size * 0.4, size / 2])
      }));
    });
  },

  SkipRight: function () {
    var size = 32;

    return Svg.Root(size, null, function (svg) {
      svg.appendChild(Svg.Element('rect', {
        x: size * 0.7,
        y: 0,
        width: size * 0.3,
        height: size
      }));

      svg.appendChild(Svg.Element('polygon', {
        points: Svg.Points([0, 0], [0, size], [size * 0.6, size / 2])
      }));
    });
  }
}
