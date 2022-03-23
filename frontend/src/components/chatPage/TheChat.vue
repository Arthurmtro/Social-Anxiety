<script>
import { useStore } from "@/store";
import { ref } from "vue";
import router from "@/router";

let timeout;

export default {
  setup() {
    const store = useStore();
    const text = ref("");

    return {
      store,
      text,
    };
  },
  unmounted() {
    clearInterval(timeout);
  },
  methods: {
    sendMessage() {
      this.$socket.emit("msgToServer", this.text);
      this.text = "";
    },
    pictureMode() {
      const video = document.getElementById("remote-video");
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        if (document.pictureInPictureEnabled) {
          video.requestPictureInPicture();
        }
      }
    },
    ajoutTempsTimer() {
      this.$store.dispatch("updateTimer", 30);
    },
  },

  computed: {
    count() {
      return this.$store.state.timer;
    },
  },
  watch: {
    count(newCount, oldCount) {
      if (newCount === 60) {
        timeout = setInterval(() => {
          if (newCount >= 1) {
            this.$store.dispatch("updateTimer", -1);
          } else {
            // router.push("/");
            clearInterval(timeout);
          }
        }, 1000);
      }
    },
  },
};
</script>

<template>
  <div class="chat">
    <div v-if="store.state.isAlreadyCalling" class="actions-buttons">
      <div>
        {{ store.state.timer }}
        <!-- <button @click="ajoutTempsTimer()">+30</button> -->
      </div>
      <button @click="pictureMode()">Picture to picture</button>
    </div>
    <ul v-if="store.state.socketMessages?.length >= 1" class="messages">
      <li v-for="message of store?.state?.socketMessages" :key="message">
        <p
          class="message-author"
          :style="[
            message.authorId === 'AnxioBot'
              ? { color: 'yellow' }
              : message.authorId == store?.state?.socket.id
              ? { color: '#407CB8' }
              : { color: '#B84040' },
          ]"
        >
          {{ message.name }}
        </p>

        <p class="message-content">{{ message.text }}</p>
      </li>
    </ul>
    <form class="inputs">
      <input v-model="text" placeholder="Entrez le message" class="saisie" />
      <input
        type="submit"
        value="Envoyer"
        :disabled="!text"
        @click="sendMessage()"
        class="send-message"
      />
    </form>
  </div>
</template>

<style>
.chat {
  color: var(--font-color);
  height: 100%;
  width: 40%;

  overflow: hidden;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  background-color: var(--background-chat-color);
}

.actions-buttons {
  display: flex;
}

.messages {
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.messages li {
  display: flex;
}

.messages li .message-author {
  font-weight: bold;
  width: 20%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 0.75rem;
}

.messages li .message-content {
  width: 100%;
  color: rgb(255, 255, 255);
  display: flex;
  justify-content: start;
  align-items: center;

  overflow-wrap: anywhere;
}

.inputs {
  display: flex;
  width: 100%;
}

.saisie {
  height: 2.78rem;
  width: 80%;
  background-color: var(--font-color);
  border: 1px solid #000;
}

.send-message {
  height: 3rem;
  width: 10.3rem;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}
</style>
