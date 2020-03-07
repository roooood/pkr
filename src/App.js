import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import GameServer from './library/Game';
import Context from './library/Context';
import Route from './Route';
import Snack from './component/Snack'
import Modal from './component/Modal';

import './assets/css/app.css';

let EventEmitter = require('events')
window.ee = new EventEmitter();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: window.innerWidth <= 900,
      isPortrait: window.matchMedia("(orientation: portrait)").matches,
      setting: {},
      menu: false
    };
    this.game = new GameServer('trade');
    autoBind(this);
  }
  componentDidMount() {
    window.addEventListener("orientationchange", this.orientationchange);
  }
  componentWillUnmoun() {
    window.removeEventListener("orientationchange", this.orientationchange);
  }
  orientationchange() {
    this.setState({ isPortrait: window.matchMedia("(orientation: portrait)").matches })
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
