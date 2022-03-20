<template>
  <div class="formulaire">
    <h1>Préparez-vous à rejoindre l'aventure</h1>
    <div class="username-input">
      <!-- <label for="username">username</label> -->
      <input
        type="text"
        v-model="username"
        placeholder="Votre username"
        id="username"
        v-on:keyup.enter="store.dispatch('sendUsername', username.trim())"
      />
      <button
        :disabled="!username"
        @click="store.dispatch('sendUsername', username.trim())"
        class="bouton"
      >
        Go Chatter
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "../store";

export default {
  setup() {
    const username = ref("");
    const store = useStore();

    return {
      username,
      store,
    };
  },
};
</script>

<style scoped>
.formulaire {
  background-color: var(--background-chat-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  border-radius: 1.5vw;
  padding: 2rem;
  box-shadow: 0 0 15px var(--background-chat-color);
}

h1 {
  color: var(--font-color);
  font-weight: 100;
  font-size: 3em;
}

.username-input {
  display: flex;
  align-items: center;
}

.username-input input {
  background: none;
  border: none;
  border-bottom: 1px solid var(--font-color);

  color: var(--font-color);
  font-size: 1.5em;
  margin: 0 1rem;

  outline: none;
}

.bouton {
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.5vw;
  padding: 1rem 3rem;

  color: var(--font-color);
  box-shadow: 0 0 15px var(--primary-color);
}

a {
  color: var(--font-color);
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

span {
  color: var(--font-color);
  font-weight: 300;
  font-size: 1.5em;
}

.bouton:hover {
  background-color: #004b1f;
  cursor: pointer;
}
</style>
