import { t } from 'locales';
export const TABBAR_ADD = 'TABBAR_ADD';
export const TABBAR_REMOVE = 'TABBAR_REMOVE';
export const TABBAR_ACTIVE = 'TABBAR_ACTIVE';

export const TabbarAdd = object => ({
  type: TABBAR_ADD,
  data: object,
});

export const TabbarRemove = object => ({
  type: TABBAR_REMOVE,
  data: object,
});

export const TabbarActive = object => ({
  type: TABBAR_ACTIVE,
  data: object,
});

const initialState = {
  data: { lobby: { name: t('lobby') } },
  active: 'lobby'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TABBAR_ADD:
      state.data[action.data.key] = action.data.value;
      return {
        ...state,
        active: action.data.key
      };
    case TABBAR_ACTIVE:
      return {
        ...state,
        active: action.data
      };
    case TABBAR_REMOVE:
      delete state.data[action.data];
      return {
        ...state
      };
    default:
      return state;
  }
};

