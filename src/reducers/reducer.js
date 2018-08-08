const defaultState = {
  user: null,
}


export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case 'SAY_HI':
      return {
        ...state, user: action.payload
      }
    default:
      return state;
  }
}
