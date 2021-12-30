import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    userName: '',
    token: null,
    games: []
  },
  reducers: {
    addGame: (state, action) => {
      state.games = [...state.games, action.payload];
    },
    setUserName: (state, action) => {
      state.userName = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setGames: (state, action) => {
      state.games = action.payload
    },
    removeGame: (state, action) => {
      state.games = state.games.filter(game => game.game_name !== action.payload);
    }
  }
})

export const { addGame, setUserName, setToken, setGames, removeGame } = gameSlice.actions;

export const selectUserName = (state: RootState) => state.game.userName;
export const selectToken = (state: RootState) => state.game.token;
export const selectGames = (state: RootState) => state.game.games;

export default gameSlice.reducer;