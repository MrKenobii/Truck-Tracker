import { createSlice } from "@reduxjs/toolkit";
import  axios  from "axios";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
    notifications: [],
    messages: []
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("token");
      } else {
        console.log(state);
        console.log(action.payload);
        if (action.payload.token) localStorage.setItem("token", action.payload.token);
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    removeNotification: (state, action) => {
      const { notificationId } = action.payload;
      state.notifications = [...state.notifications].filter(e => e.notificationId.toString() !== notificationId.toString());
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    removeMessage: (state, action) => {
      const { messageId } = action.payload;
      state.messages = [...state.messages].filter(e => e.messageId.toString() !== messageId.toString());
    },
    addMessage: (state, action) => {
      state.messages = [action.payload, ...state.messages];
    },
  }
});

export const {
  setUser,
  setNotifications,
  addNotification,
  removeNotification,
  setMessage,
  addMessage,
  removeMessage
} = userSlice.actions;

export default userSlice.reducer;