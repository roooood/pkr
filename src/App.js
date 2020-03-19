import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "redux/store";

import { getQuery } from 'library/Helper';
import GameServer from 'library/Game';
import Context from 'library/Context';
import Route from './Route';
import Snack from 'component/component/Snack';
import Modal from 'component/component/Modal';
import request from 'library/Fetch';
import Avatar from 'component/component/Avatar';
import Rotate from 'component/component/Rotate';

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
      dir: dir
    };
    this.game = new GameServer('poker');
    autoBind(this);
  }
  componentDidMount() {
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
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={this.renderLoading()}>
          <Context.Provider value={{ game: this.game, state: this.state, app: this.app, update: this.update, setState: this.changeState }}>
            <Snack />
            <Rotate />
            <Modal ref={r => this.modal = r} />
            <Route />
          </Context.Provider>
        </PersistGate>
      </Provider >
    );
  }
}

export default App;
