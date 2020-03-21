import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { getQuery } from 'library/Helper';
import GameServer from 'library/Game';
import Context from 'library/Context';
import Route from './Route';
import Snack from 'component/component/Snack';
import Modal from 'component/component/Modal';
import request from 'library/Fetch';
import Avatar from 'component/component/Avatar';
import Rotate from 'component/component/Rotate';
import { t } from 'locales';

import 'assets/css/app.css';
import 'assets/css/table.css';
import 'assets/css/cards.css';

let EventEmitter = require('events')
window.ee = new EventEmitter();

const lang = getQuery('lang') || 'fa';
const dir = lang == 'fa' ? 'rtl' : 'ltr'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userKey: getQuery('token') || '-',
      user: {},
      isMobile: window.innerWidth <= 950,
      dir: dir,
      standing: [],
      tab: {
        data: { lobby: { name: t('lobby') } },
        active: 'lobby'
      }
    };
    this.game = new GameServer('poker');
    autoBind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', (event)=> {
      let isMobile = window.innerWidth <= 950;
      if (isMobile != this.state.isMobile) {
        this.setState({ isMobile})
      }
    });
    if (this.state.userKey != '-') {
      request('info/' + this.state.userKey, res => {
        if (typeof res == 'object') {
          if (res.result == 'ok') {
            if (res.data.avatar == null) {
              this.modal.show(<Avatar />)
            }
            this.setState({ user: res.data })
          }
        }
      });
    }
  }
  changeState(obj) {
    this.setState(obj)
  }
  app(obj) {
    return this[obj];
  }
  update() {
    this.forceUpdate();
  }
  renderLoading() {
    return null;
  }
  render() {
    return (
      <Context.Provider
        value={{
          game: this.game,
          state: this.state,
          app: this.app,
          update: this.update,
          setState: this.changeState
        }}>
        <Snack />
        <Rotate />
        <Modal ref={r => this.modal = r} />
        <Route />
      </Context.Provider>
    );
  }
}

export default App;
