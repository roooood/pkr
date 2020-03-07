import storage from 'redux-persist/lib/storage'
import { applyMiddleware, createStore, compose } from "redux";
//import { createLogger } from 'redux-logger';
//import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from "redux-persist";

import rootReducer from "./action";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['market']
};

const middlewares = [];

// if (__DEV__) {
//   middlewares.push(createLogger());
// }

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  undefined,
  applyMiddleware(...middlewares) //composeWithDevTools(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);
