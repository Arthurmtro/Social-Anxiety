<script>
import { useStore } from "@/store";

export default {
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
};
</script>

<template>
  <div>
    <div class="connected" v-if="store.state.isConnected">
      <div class="rond" style="background-color: green" />
      Connecté !
    </div>
    <div class="disconnected" v-else>
      <div class="rond" style="background-color: red" />
      La connexion a un problème
    </div>
  </div>
</template>

<style scoped>
.connected {
  display: flex;
  align-items: center;
  justify-content: right;
  margin: 1rem 1rem 0 0;
  color: #c3c3c3;
}

.disconnected {
  display: flex;
  align-items: center;
  justify-content: right;
  margin: 1rem 1rem 0 0;
  color: #c3c3c3;
}

.rond {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 1rem;
}
</style>
