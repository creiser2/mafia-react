import { addUser } from '../actions/actions'

const defaultState = {
  user: null,
}


export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case addUser:
      return {
        ...state, user: action.payload
      }
    default:
      return state;
  }
}
