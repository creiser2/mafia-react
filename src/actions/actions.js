export const addUser = () => (
  {
    type: 'ADD_USER'
  }
)

export const addLobbyName = (name) => (
  {
    type: 'ADD_LOBBY_NAME',
    payload: name
  }
)
