const defaultState = {
  users: [],
  user: {},
  username: "",
  lobbyExists: false,
  lobbyName: null,
  lobbyPassword: null,
  lobbyId: null,
  isHost: false,
  mafiaExists: false,
  turn: "mafia",
  votes: [],
  lobbyLog: "",
  log: ""
}


export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case "SET_USER":
      return {
        ...state, user: action.payload
      }
    case "SET_USERS":
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
    case "SET_HOST":
      return {
        ...state, isHost: true
      }
    case "SET_ROLE":
      return {
        ...state,
        user: {
          ...state.user,
          role: action.payload
        }
      }
    case "SET_TURN":
      return {
        ...state, turn: action.payload
      }
    case "DECREMENT_ROUNDS":
      return {
        ...state, rounds: state.rounds-1
      }
    case "MAFIA_EXISTS":
      return {
        ...state, mafiaExists: action.payload
      }
    case "KILL_VICTIM":
      return {
        ...state, users: action.payload
      }
    case "USER_DIED":
      return {
        ...state,
        user: {
          ...state.user,
          alive: false
        }
      }
    case "CAST_VOTE":
      return {
        ...state, votes: action.payload
      }
    case "CLEAR_VOTES":
      return {
        ...state, votes: []
      }
    case "UPDATE_LOBBY_LOG":
      return {
        ...state, lobbyLog: action.payload
      }
    case "UPDATE_LOG":
      return {
        ...state, log: action.payload
      }
    default:
      return state;
  }
}
