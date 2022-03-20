<template>
  <h1 class="nigger">{{ msg }}</h1>
  <a href="https://rr.noordstar.me/a9ad662d" target="_blank">Join a room</a>
  <br />
  <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();
</script>

<style scoped>
a {
  color: #42b983;
}

.nigger {
  color: red;
}
</style>
