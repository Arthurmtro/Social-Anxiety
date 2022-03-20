import SocketInstance from "socket.io-client";
import VueSocketIO from "vue-3-socket.io";

import store from "./store";

// export const socket: VueSocketIO<any> = new VueSocketIO<any>({
//   debug: true,
//   connection: SocketInstance("http://localhost:3001"),
//   vuex: {
//     store,
//     actionPrefix: "SOCKET_",
//     mutationPrefix: "SOCKET_",
//   },
// });
