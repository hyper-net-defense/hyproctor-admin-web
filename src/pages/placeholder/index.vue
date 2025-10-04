<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const title = route.meta.title || route.name || 'Page';
</script>

<template>
  <div class="placeholder-page">
    <h2>{{ title }}</h2>
    <p>This is a placeholder page for <strong>{{ title }}</strong>.</p>
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 24px;
}
</style>
