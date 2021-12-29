import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    userName: ''
  },
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload
    }
  }
})

export const { setUserName } = gameSlice.actions;

export default gameSlice.reducer;