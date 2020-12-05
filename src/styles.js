var styles = {
  '@keyframes fetch-blink': {
    '0%': {
      opacity: .8
    },
    '50%': {
      opacity: .3
    },
    '100%': {
      opacity: .8
    }
  },
  '*': {
    boxSizing: 'border-box'
  },
  'html, body': {
    height: '100%',
    margin: 0
  },
  'body': {
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white'
  },
  '.main': {
    width: '100%',
    maxWidth: '800px',
    height: '100%',
    maxHeight: '600px',
    margin: '0 auto',
    border: '1px solid black',
    backgroundColor: '#eee',
    paddingTop: '106px'
  },
  '.player': {
    textAlign: 'center',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: '1px 0',
    display: 'flex',

    '-progress': {
      height: '38px',
      border: '1px solid black',
      flex: 1,
      margin: '6px 4px',
      position: 'relative',
      background: '#f9f9f9',
      boxShadow: '2px 2px 2px #777',

      '-bar': {
        height: '100%',
        width: '0',
        background: '#99e'
      }
    },

    '-track': {
      position: 'absolute',
      top: '2px',
      left: '4px',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'left',
      fontSize: '12px'
    },
    '-position': {
      position: 'absolute',
      top: '2px',
      right: '2px',
      fontSize: '12px'
    },
    '-duration': {
      position: 'absolute',
      bottom: '2px',
      right: '2px',
      fontSize: '12px'
    }
  },
  '.player-button': {
    margin: '4px',
    border: '1px solid black',
    padding: '4px',
    verticalAlign: 'middle',
    borderRadius: '4px',
    cursor: 'pointer',
    background: '#f9f9f9',
    boxShadow: '2px 2px 2px #777',

    '>svg': {
      verticalAlign: 'middle'
    },
  },
  '.play-svg': { display: 'none' },
  '.pause-svg': { display: 'none' },
  '.fetch-svg': {
    display: 'none',
    animation: '1s fetch-blink linear infinite'
  },
  '.play': {
    ' .play-svg': { display: 'inline-block' }
  },
  '.pause': {
    ' .pause-svg': { display: 'inline-block' }
  },
  '.fetching': {
    ' .fetch-svg': { display: 'inline-block' }
  },
  '.crumbs': {
    marginTop: '-106px',

    '-item': {
      display: 'inline-block',
      width: '20%',
      padding: '2px',

      ' .crumbs-item-content': {
        border: '1px solid black',
        padding: '2px 5px',
        background: '#ddd',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        cursor: 'default'
      },

      '.short': {
        width: '10%',
        textAlign: 'center'
      },

      '.active': {
        ' .crumbs-item-content': {
          background: '#ddf',
          cursor: 'pointer'
        }
      }
    },

    '-title': {
      textAlign: 'center',
      fontWeight: 'bold',
      height: '24px',
      lineHeight: '24px'
    }
  },
  '.list-item': {
    padding: '4px 4px 4px 20px',
    fontFamily: 'monospace',
    fontSize: '16px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    position: 'relative',

    '.current': {
      ' .list-item-name': {
        fontWeight: '900'
      },

      ':before': {
        display: 'inline-block',
        width: '20px',
        marginLeft: '-20px',
        content: '">"',
        textAlign: 'center'
      }
    },

    '.DIRECTORY': {
      color: '#007',
      fontWeight: '900',

      ':before': {
        content: '"[ "'
      },
      ':after': {
        content: '" ]"'
      }
    },

    '-name': {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    '-size': {
      width: '100px',
      textAlign: 'right'
    },

    '-control': {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      left: 0,
      top: '50%',
      right: 0,
      bottom: '50%',
      background: '#f9f9f9',
      overflow: 'hidden',
      transition: 'bottom .2s ease-in-out, top .2s ease-in-out',

      ' .play-svg': {
        display: 'inline-block',
        width: '16px',
        margin: '0 5px'
      },

      '.active': {
        bottom: 0,
        top: 0
      }
    }
  },
  '.content': {
    height: '100%',
    position: 'relative',

    '-list': {
      height: '100%',
      overflowY: 'auto',
    }
  },
  '.curtain': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: '100%',
    background: 'rgba(200, 200, 200, .7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    opacity: 0,
    transition: 'opacity .2s ease-in-out, bottom .2s step-end',

    '.active': {
      bottom: '0',
      opacity: 1,
      transition: 'opacity .2s ease-in-out, bottom .2s step-start',
    },

    ':before': {
      display: 'block',
      content: '""',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'black',
      opacity: '.7',
      animation: '1s fetch-blink linear infinite'
    }
  }
};
