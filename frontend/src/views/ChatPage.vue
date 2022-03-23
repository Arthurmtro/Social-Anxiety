<script>
import { useStore } from "@/store";
import router from "@/router";

import TheVideo from "@/components/chatPage/TheVideo.vue";
import TheChat from "@/components/chatPage/TheChat.vue";
import TheUser from "@/components/chatPage/TheUser.vue";

const REFRESH_RATE = 500;

let refreshInterval;

export default {
  components: {
    TheChat,
    TheUser,
    TheVideo,
  },
  setup() {
    const store = useStore();
    if (!store.state.currentUser || !store.state.currentUser.username) {
      router.push("/");
      router.push("/");
    }
  },
  mounted() {
    const store = useStore();
    refreshInterval = setInterval(() => {
      console.log("Refreshing state");
      if (store.state.currentUser.inQueue) {
        return;
      }
      console.log("In a call");
    }, REFRESH_RATE);
  },
  unmounted() {
    clearInterval(refreshInterval);
  },
};
</script>

<template>
  <div id="page">
    <div class="body">
      <the-user />
      <the-video />
      <the-chat />
    </div>
  </div>
</template>

<style scoped>
#page {
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.body {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
