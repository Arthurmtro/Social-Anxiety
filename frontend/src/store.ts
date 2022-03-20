import { createStore, useStore as baseUseStore, Store } from "vuex";
import { InjectionKey } from "vue";
import router from "./router";

// Types
import { UserType } from "./types/user.type";

import { Socket } from "socket.io-client";

export interface IState {
  peerConnection: RTCPeerConnection;
  connectedUsers: UserType[];
  isAlreadyCalling: boolean;
  socketMessages: string[];
  isConnected: boolean;
  socket?: Socket;
  remoteUserTalking: boolean;
  timer: number;
}

export const key: InjectionKey<Store<IState>> = Symbol();

const store = createStore<IState>({
  state: {
    peerConnection: new RTCPeerConnection(),
    isAlreadyCalling: false,
    isConnected: false,
    socket: undefined,
    socketMessages: [],
    connectedUsers: [],
    remoteUserTalking: false,
    timer: -1,
  },
  actions: {
    updateTimer: (_context: any, value: number) => {
      store.state.timer += value;
    },
    remoteUserStateChange: (_context: any, newState: boolean) => {
      store.state.remoteUserTalking = newState;
    },
    sendUsername: async (_context: any, username: string) => {
      if (!store.state.socket) return;

      store.state.socket.emit("setUsername", username);
    },
    callUser: async (_context: any, socketId: string) => {
      if (!store.state.socket) return;

      const offer = await store.state.peerConnection.createOffer();
      await store.state.peerConnection.setLocalDescription(
        new RTCSessionDescription(offer)
      );

      store.state.socket.emit("callUser", {
        offer,
        to: socketId,
      });
    },
  },
  mutations: {
    setSocket: (state, socket) => {
      state.socket = socket;
    },

    SOCKET_connect(state) {
      console.log("Socket connect");
      state.isConnected = true;
    },
    SOCKET_disconnect(state) {
      state.isConnected = false;
    },
    SOCKET_messageChannel(state, message: string) {
      state.socketMessages.push(message);
    },
    SOCKET_updateUserList(state, users: { users: UserType[] }) {
      state.connectedUsers = users.users;
    },
    SOCKET_removeUser(state, socketId: string) {
      if (!state.connectedUsers || state.connectedUsers.length === 0) return;

      state.connectedUsers = state.connectedUsers.filter(
        (user) => user.id == socketId
      );
    },
    async SOCKET_callMade(state, data: any) {
      if (!state.socket) return;

      await store.state.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const answer = await store.state.peerConnection.createAnswer();

      await store.state.peerConnection.setLocalDescription(
        new RTCSessionDescription(answer)
      );

      console.log("SOCKET_callMade socket", data.socket);

      state.socket.emit("makeAnswer", {
        answer,
        to: data.socket,
      });
      store.state.timer = 60;
      state.isAlreadyCalling = true;
    },
    async SOCKET_answerMade(state, data: any) {
      if (!state.socket) return;

      console.log("SOCKET_answerMade socket", data.socket);

      await store.state.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!state.isAlreadyCalling) {
        store.dispatch("callUser", data.socket);
        state.isAlreadyCalling = true;
        store.state.timer = 60;
      } else {
        console.log("Already calling");
      }
    },
    SOCKET_accessToChatroom(state, users: { users: UserType[] }) {
      state.connectedUsers = users.users;

      router.push("/chat");
    },
  },
  // plugins: [createLogger()],
});

export function useStore() {
  return baseUseStore(key);
}

export default store;
