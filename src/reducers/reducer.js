import { addUser } from '../actions/actions'

const defaultState = {
  user: null,
  lobbyExists: false,
  lobbyName: null,
  lobbyPassword: null
}


export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case "ADD_USER":
      return {
        ...state, user: action.payload
      }
    case "ADD_LOBBY_NAME":
      return {
        ...state, lobbyName: action.payload
      }
    case "ADD_LOBBY_PASSWORD":
      return {
        ...state, lobbyPassword: action.payload
      }
    case "OPEN_LOBBY":
      return {
        ...state, lobbyExists: true
      }
    case "CLOSE_LOBBY":
      return {
        ...state, lobbyExists: false
      }
    default:
      return state;
  }
}
