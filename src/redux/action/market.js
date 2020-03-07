export const MARKET_DATA = 'MARKET_DATA';

export const Market = object => ({
  type: MARKET_DATA,
  data: object,
});

const initialState = {
  crypto: null,
  forex: null,
  stock: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MARKET_DATA:
      if (action.data == null) {
        return {
          ...initialState,
        };
      };
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

