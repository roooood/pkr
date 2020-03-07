export const USER_DATA = 'USER_DATA';

export const User = object => ({
  type: USER_DATA,
  data: object,
});

const initialState = {
  token: '',
  isLogin: false
};

export default (state = initialState, action) => {
  let login = action.token == '';
  switch (action.type) {
    case USER_DATA:
      if (action.data == null) {
        return {
          ...initialState,
        };
      };
      return {
        ...state,
        ...action.data,
        isLogin: !login
      };
    default:
      return state;
  }
};

