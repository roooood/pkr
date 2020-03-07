import { combineReducers } from "redux";

import user from "./user";
import market from "./market";
import tab from "./tab";

export default combineReducers({
  user,
  market,
  tab
});
