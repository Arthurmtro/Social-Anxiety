<script>
import { ref } from "vue";
import { useStore } from "../store";

export default {
  props: {
    method: { type: Function },
  },
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

<template>
  <div class="formulaire">
    <h1>Préparez-vous à rejoindre l'aventure</h1>
    <div v-if="store.state.isConnected" class="username-input">
      <input
        type="text"
        v-model="username"
        placeholder="Votre username"
        id="username"
        v-on:keyup.enter="this.method(username)"
      />
      <button
        :disabled="!username"
        @click="this.method(username)"
        class="bouton"
      >
        Go Chatter
      </button>
    </div>
    <div class="disconnected" v-else>
      <p>La connexion a un problème...</p>
    </div>
  </div>
</template>

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

.disconnected {
  font-size: 1.5rem;
  color: rgb(202, 4, 4);
}
</style>
