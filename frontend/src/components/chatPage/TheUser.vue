<script>
import { useStore } from "@/store";

export default {
  setup() {
    const store = useStore();

    return { store };
  },
};
</script>

<template>
  <div id="menuUsers">
    <h3>Users</h3>
    <ul>
      <li
        v-for="user of store?.state?.connectedUsers.filter(
          (user) => user.id !== store.state.socket.id && user.username
        )"
        :key="user"
        @click="store.dispatch('callUser', user.id)"
      >
        <p>{{ user.username }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#menuUsers {
  color: #c3c3c3;
  margin: 0 1rem;
  border: 1px solid rgb(0, 0, 0);
  border-right: none;
  margin: 0;
  width: 15rem;
}
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
li {
  text-align: center;
  border-bottom: 1px solid #000;
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
}
</style>
