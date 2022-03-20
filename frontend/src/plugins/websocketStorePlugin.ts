import { Socket } from "socket.io-client";

import store from "../store";

export default function createWebSocketPlugin(socket: any) {
  return (store: any) => {
    socket.on("data", (data: any) => {
      store.commit("receiveData", data);
    });
    store.subscribe((mutation: any) => {
      if (mutation.type === "UPDATE_DATA") {
        socket.emit("update", mutation.payload);
      }
    });
  };
}

// export default function createWebSocketPlugin (socket: any) {
//     return store => {
//       store.$socket = socket
//       socket.on('message', payload => store.dispatch('receiveMessage', payload))
//     }
//   }
