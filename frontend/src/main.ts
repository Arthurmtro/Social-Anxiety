import SocketInstance from "socket.io-client";
import VueSocketIO from "vue-3-socket.io";
import { createApp } from "vue";

// Store
import store, { key } from "./store";

// Router
import router from "./router";

// Components
import App from "./App.vue";

export const socket = new VueSocketIO<any>({
  debug: false,
  connection: SocketInstance("http://localhost:3001"),
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_",
  },
});

const vueApp = createApp(App);

vueApp.use(socket);
vueApp.use(store, key);
vueApp.use(router);

vueApp.mount("#app");
