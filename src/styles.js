var styles = {
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
    justifyContent: 'center'
  },
  '.main': {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid black'
  },
  '.player': {
    textAlign: 'center',
    borderBottom: '1px solid black',

    '-progress': {
      height: '16px',
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
    whiteSpace: 'nowrap'
  },
  '.skip-left': {
    ':before': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      width: '10px',
      boxSizing: 'border-box',
      borderColor: 'black white black white',
      borderStyle: 'solid',
      borderWidth: '20px 0'
    },
    ':after': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white black white white',
      borderStyle: 'solid',
      borderWidth: '20px 28px 20px 2px',
      boxSizing: 'border-box'
    }
  },
  '.skip-right': {
    ':before': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white white white black',
      borderStyle: 'solid',
      borderWidth: '20px 2px 20px 28px',
      boxSizing: 'border-box'
    },
    ':after': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      width: '10px',
      boxSizing: 'border-box',
      borderColor: 'black white black white',
      borderStyle: 'solid',
      borderWidth: '20px 0'
    }
  },
  '.seek-left': {
    ':before': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white black white white',
      borderStyle: 'solid',
      borderWidth: '20px 19px 20px 0',
      boxSizing: 'border-box'
    },
    ':after': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white black white white',
      borderStyle: 'solid',
      borderWidth: '20px 19px 20px 2px',
      boxSizing: 'border-box'
    }
  },
  '.seek-right': {
    ':before': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white white white black',
      borderStyle: 'solid',
      borderWidth: '20px 0 20px 19px',
      boxSizing: 'border-box'
    },
    ':after': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white white white black',
      borderStyle: 'solid',
      borderWidth: '20px 2px 20px 19px',
      boxSizing: 'border-box'
    }
  },
  '.play': {
    ':before': {
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white white white black',
      borderStyle: 'solid',
      borderWidth: '20px 0 20px 40px',
      boxSizing: 'border-box',
      transition: 'border-width ease-in-out .3s'
    },
    ':after': {
      height: '40px',
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white black white white',
      borderStyle: 'solid',
      borderWidth: '0 0 0 0',
      boxSizing: 'border-box',
      transition: 'border-width ease-in-out .3s'
    }
  },
  '.pause': {
    ':before': {
      height: '40px',
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white white white black',
      borderStyle: 'solid',
      borderWidth: '0 0 0 15px',
      boxSizing: 'border-box',
      transition: 'border-width ease-in-out .3s'
    },
    ':after': {
      height: '40px',
      display: 'inline-block',
      content: '""',
      verticalAlign: 'middle',
      borderColor: 'white black white white',
      borderStyle: 'solid',
      borderWidth: '0 15px 0 10px',
      boxSizing: 'border-box',
      transition: 'border-width ease-in-out .3s'
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
