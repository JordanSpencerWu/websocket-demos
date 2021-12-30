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
    addUserName: (state, action) => {
      state.userName = action.payload
    },
    addToken: (state, action) => {
      state.token = action.payload
    }
  }
})

export const { addUserName, addToken } = gameSlice.actions;

export const selectUser = (state: RootState) => state.game.userName;
export const selectToken = (state: RootState) => state.game.token;
export const selectGames = (state: RootState) => state.game.games;

export default gameSlice.reducer;