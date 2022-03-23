<script>
import { useStore } from "@/store";

export default {
  beforeCreate() {
    const store = useStore();
    store.commit("setSocket", this.$socket);
  },
};
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@font-face {
  font-family: "Roboto";
  src: local("Roboto"), url(./Roboto-Regular.ttf) format("truetype");
}

:root {
  --primary-color: #046622;
  --background-color: #181818;
  --background-chat-color: #3a3a3a9d;

  --font-color: #f7f7f7;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  background-color: var(--background-color);
  height: 100vh;
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #c3c3c3 #e60404;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: var(--background-chat-color);
}

*::-webkit-scrollbar-thumb {
  background-color: #4e4e4e;
}
</style>
