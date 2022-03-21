<script>
import FormulaireAccueil from "@components/FormulaireAccueil.vue";
import { ref } from "vue";

export default {
  setup() {
    const text = ref("");

    return {
      text,
    };
  },
  components: {
    FormulaireAccueil,
  },
  methods: {
    joinChatQueue(username) {
      this.$store.dispatch("joinChatQueue", username.trim());
    },
  },
};
</script>

<template>
  <div id="home-page">
    <div class="titles">
      <h1 class="app-title">Social Anxiety</h1>
      <caption class="app-desc">
        Decouvrez du peuple en un temps record !
      </caption>
    </div>

    <formulaire-accueil :method="joinChatQueue" />
  </div>
</template>

<style scoped>
#home-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
}

.titles {
  margin: 0;
  padding: 0;
}

.app-title {
  font-weight: 200;
  color: var(--font-color);
  font-size: 5.5em;
  text-align: center;
}

.app-desc {
  font-weight: lighter;
  color: var(--font-color);
  font-size: 2em;
  width: 100%;
  display: block;
}
</style>
