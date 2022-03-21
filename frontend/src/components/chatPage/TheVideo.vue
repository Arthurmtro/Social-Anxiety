<script>
import { ref } from "vue";
import { useStore } from "@/store";

const REFRESH_VIDEO_RATE = 200;

let refreshInterval;

export default {
  setup() {
    const store = useStore();
    const tailleVideoAutre = ref(50);
    const tailleVideoMoi = ref(50);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
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
      })
      .catch((error) => {
        console.warn(error.message);
      });

    setInterval(() => {
      const receiver = store.state.peerConnection.getReceivers().find((r) => {
        return r.track.kind === "audio";
      });
      if (receiver && receiver.getSynchronizationSources) {
        const source = receiver.getSynchronizationSources()[0];
        if (source && source.audioLevel >= 0.01) {
          // IsTalking
          // store.dispatch("remoteUserStateChange", true);
        } else {
          // store.dispatch("remoteUserStateChange", false);
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

    return {
      store,
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
  mounted() {
    refreshInterval = setInterval(() => {
      // if(this.$store.)
    }, REFRESH_VIDEO_RATE);
  },
  unmounted() {
    clearInterval(refreshInterval);
  },
};
</script>

<template>
  <div class="video-container">
    <video
      autoplay
      class="remote-video"
      id="remote-video"
      :style="[
        store.state.timer > 0 ? { display: 'block' } : { display: 'none' },

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
        store.state.timer > 0 ? null : { width: '100%' },
      ]"
      @click="changerTailleVideo(30, 70)"
    />
  </div>
</template>

<style scoped>
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
