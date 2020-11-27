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

    '-progress': {
      height: '32px',
      border: '1px solid black',

      '-bar': {
        height: '100%',
        width: '0',
        background: '#99e'
      }
    }
  },
  '.player-button': {
    display: 'inline-block',
    margin: '5px',
    border: '1px solid black',
    padding: '5px',
    verticalAlign: 'middle',
    borderRadius: '4px',
    width: '52px',
    whiteSpace: 'nowrap',

    ':before': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      borderStyle: 'solid',
    },
    ':after': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      borderStyle: 'solid',
    }
  },
  '.skip-left': {
    ':before': {
      width: '10px',
      borderColor: 'black white black white',
      borderWidth: '20px 0'
    },
    ':after': {
      borderColor: 'white black white white',
      borderWidth: '20px 28px 20px 2px'
    }
  },
  '.skip-right': {
    ':before': {
      borderColor: 'white white white black',
      borderWidth: '20px 2px 20px 28px'
    },
    ':after': {
      width: '10px',
      borderColor: 'black white black white',
      borderWidth: '20px 0'
    }
  },
  '.play': {
    ':before': {
      borderColor: 'white white white black',
      borderWidth: '20px 0 20px 40px'
    },
    ':after': {
      height: '40px',
      borderColor: 'white black white white',
      borderWidth: '0 0 0 0'
    }
  },
  '.pause': {
    ':before': {
      height: '40px',
      borderColor: 'white white white black',
      borderWidth: '0 0 0 15px'
    },
    ':after': {
      height: '40px',
      borderColor: 'white black white white',
      borderWidth: '0 15px 0 10px'
    }
  },
  '.fetching': {
    ':before': {
      height: '40px',
      borderColor: 'black',
      borderWidth: '0 40px 0 0',
      borderRadius: '50%',
      animation: 'fetch-blink 1s linear infinite'
    }
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
      fontWeight: 'bold'
    }
  }
};
