import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import { getQuery } from './library/Helper';
import GameServer from './library/Game';
import Context from './library/Context';
import Route from './Route';
import Snack from './component/component/Snack';
import Modal from './component/component/Modal';

import './assets/css/app.css';
import './assets/css/table.css';
import './assets/css/cards.css';

let EventEmitter = require('events')
window.ee = new EventEmitter();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userKey: getQuery('token') || '-',
      isMobile: window.innerWidth <= 900,
    };
    this.game = new GameServer('poker');
    autoBind(this);
  }
  changeState(obj) {
    this.setState(obj)
  }
  app(obj) {
    return this[obj];
  }
  renderLoading() {
    return null;
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={this.renderLoading()}>
          <Context.Provider value={{ game: this.game, state: this.state, app: this.app, setState: this.changeState }}>
            <Snack />
            <Modal ref={r => this.modal = r} />
            <Route />
          </Context.Provider>
        </PersistGate>
      </Provider >
    );
  }
}

export default App;
