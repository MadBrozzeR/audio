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
    maxWidth: '600px',
    height: '100%',
    maxHeight: '600px',
    margin: '0 auto',
    border: '1px solid black',
    backgroundColor: '#eee'
  },
  '.player': {
    textAlign: 'center',
    borderBottom: '1px solid black',
    display: 'flex',

    '-progress': {
      height: '42px',
      border: '1px solid black',
      flex: 1,
      margin: '4px',

      '-bar': {
        height: '100%',
        width: '0',
        background: '#99e'
      }
    }
  },
  '.player-button': {
    margin: '4px',
    border: '1px solid black',
    padding: '4px',
    verticalAlign: 'middle',
    borderRadius: '4px',
    cursor: 'pointer',

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
    paddingLeft: '20px',
    fontFamily: 'monospace',
    fontSize: 'large',
    cursor: 'pointer',

    '.current': {
      fontWeight: '900',

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
    }
  }
};
