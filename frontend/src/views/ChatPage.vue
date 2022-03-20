<script>
import AmIConnected from "@/components/AmIConnected.vue";
import TheChat from "@/components/chatPage/TheChat.vue";
import TheUser from "@/components/chatPage/TheUser.vue";
import video from "@/asssets/loading-video.mp4";
import { useStore } from "@/store";
import router from "@/router";
import { ref } from "vue";

export default {
  components: {
    AmIConnected,
    TheChat,
    TheUser,
  },
  setup() {
    const store = useStore();
    const tailleVideoAutre = ref(50);
    const tailleVideoMoi = ref(50);

    // @ts-ignore
    navigator.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        const localVideo = document.getElementById("local-video");
        if (localVideo) {
          // @ts-ignore
          localVideo.srcObject = stream;
        }

        stream
          .getTracks()
          .forEach((track) =>
            store.state.peerConnection.addTrack(track, stream)
          );
      },
      (error) => {
        console.warn(error.message);
      }
    );

    setInterval(() => {
      const receiver = store.state.peerConnection.getReceivers().find((r) => {
        return r.track.kind === "audio";
      });
      if (receiver && receiver.getSynchronizationSources) {
        const source = receiver.getSynchronizationSources()[0];
        if (source && source.audioLevel >= 0.01) {
          store.dispatch("remoteUserStateChange", true);
        } else {
          store.dispatch("remoteUserStateChange", false);
        }
      }
    }, 200);

    store.state.peerConnection.ontrack = ({ streams: [stream] }) => {
      const remoteVideo = document.getElementById("remote-video");
      if (remoteVideo) {
        // @ts-ignore
        remoteVideo.srcObject = stream;
      }
    };

    const localUser = JSON.parse(
      JSON.stringify(store.state.connectedUsers)
    ).find((user) => user.id === store.state.socket.id);

    if (!localUser || !localUser.username) {
      router.push("/");
    }

    return {
      store,
      video,
      tailleVideoAutre,
      tailleVideoMoi,
    };
  },
  methods: {
    changerTailleVideo(tailleAutre, tailleMoi) {
      if (this.tailleVideoAutre == tailleAutre) {
        this.tailleVideoAutre = 50;
        this.tailleVideoMoi = 50;
      } else {
        this.tailleVideoAutre = tailleAutre;
        this.tailleVideoMoi = tailleMoi;
      }
    },
  },
};
</script>

<template>
  <!-- <am-i-connected /> -->
  <div id="page">
    <div class="body">
      <the-user />
      <div class="video-container">
        <video
          autoplay
          class="remote-video"
          id="remote-video"
          :style="[
            store.state.timer >= 0 ? { display: 'block' } : { display: 'none' },

            store.state.remoteUserTalking
              ? { border: '5px solid green' }
              : { border: '5px solid #181818' },
            { width: tailleVideoAutre + '%' },
          ]"
          @click="changerTailleVideo(70, 30)"
        />
        <video
          controls="false"
          autoplay
          muted
          class="local-video"
          id="local-video"
          :style="[
            { width: tailleVideoMoi + '%' },
            store.state.timer >= 0 ? null : { width: '100%' },
          ]"
          @click="changerTailleVideo(30, 70)"
        />
      </div>
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

.video-container {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  padding: 1rem;
}

.remote-video {
  background-color: #123;
  border-radius: 10px;
  margin: 2rem;
  transition: all 0.25s ease-in-out;
}

.local-video {
  border-radius: 10px;
  transition: all 1s ease-in-out;
}
</style>
