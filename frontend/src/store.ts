import { createStore, useStore as baseUseStore, Store } from "vuex";
import { InjectionKey } from "vue";
import router from "./router";

// Types
import { UserType } from "./types/user.type";

import { Socket } from "socket.io-client";

export interface IMessage {
  authorId: string;
  name: string;
  text: string;
}

export interface IState {
  peerConnection: RTCPeerConnection;
  connectedUsers: UserType[];
  currentUser?: UserType;
  isAlreadyCalling: boolean;
  socketMessages: IMessage[];
  isConnected: boolean;
  socket?: Socket;
  timer: number;
}

export const key: InjectionKey<Store<IState>> = Symbol();

const store = createStore<IState>({
  state: {
    peerConnection: new RTCPeerConnection(),
    isAlreadyCalling: false,
    currentUser: undefined,
    isConnected: false,
    socket: undefined,
    socketMessages: [
      {
        authorId: "AnxioBot",
        name: "AnxioBot",
        text: "En attente de quelqu'un...",
      },
      {
        authorId: "AnxioBot",
        name: "AnxioBot",
        text: "Merci d'etre respectueux les uns envers les autres, SHEEESHH",
      },
    ],
    connectedUsers: [],
    timer: 0,
  },
  actions: {
    updateTimer: (_context: any, value: number) => {
      store.state.timer += value;
    },
    joinChatQueue: async (_context: any, username: string) => {
      if (!store.state.socket) return;
      store.state.socket.emit("joinChatQueue", username);
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

      state.currentUser = JSON.parse(JSON.stringify(state.connectedUsers)).find(
        (user: UserType) => user.id === socket.id
      );
    },

    SOCKET_connect(state) {
      console.log("Socket connect");
      state.isConnected = true;
    },
    SOCKET_disconnect(state) {
      state.isConnected = false;
    },
    SOCKET_messageChannel(state, message: IMessage) {
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

      const userJoinded = store.state.connectedUsers.find(
        (user) => user.id === data.socket
      );

      state.socketMessages = [
        {
          authorId: "AnxioBot",
          name: "AnxioBot",
          text: `${userJoinded?.username} entered the chat...`,
        },
      ];
    },
    async SOCKET_answerMade(state, data: any) {
      if (!state.socket) return;

      await store.state.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!state.isAlreadyCalling) {
        store.dispatch("callUser", data.socket);
        state.isAlreadyCalling = true;
        store.state.timer = 60;

        const userJoinded = store.state.connectedUsers.find(
          (user) => user.id === data.socket
        );

        state.socketMessages = [
          {
            authorId: "AnxioBot",
            name: "AnxioBot",
            text: `${userJoinded?.username} entered the chat...`,
          },
        ];
      } else {
        console.log("Already calling");
      }
    },
    SOCKET_accessToChatroom(state, users: { users: UserType[] }) {
      state.connectedUsers = users.users;

      console.log("state.connectedUsers", state.connectedUsers);

      router.push("/chat");
    },
  },
  // plugins: [createLogger()],
});

export function useStore() {
  return baseUseStore(key);
}

export default store;
