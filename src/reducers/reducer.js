const defaultState = {
  users: [],
  user: {},
  username: "",
  lobbyExists: false,
  lobbyName: null,
  lobbyPassword: null,
  lobbyId: null,
}


export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case "SET_USER":
      return {
        ...state, user: action.payload
      }
    case "ADD_USER":
      return {
        ...state, users: action.payload
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
    case "ADD_USERNAME":
      return {
        ...state, username: action.payload
      }
    case "ADD_LOBBY_ID":
      return {
        ...state, lobbyId: action.payload
      }
    default:
      return state;
  }
}
