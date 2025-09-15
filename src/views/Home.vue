<template>
  <div class="home">
    <Header />
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'HomeView',
  components: {
    Header,
  }
}
</script>

<style lang="scss" scoped>
.home {
  background: #f5f5f5;
  min-height: calc(100vh - 80px);
}
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  box-sizing: border-box;
}
.content:has(.search-container) {
  max-width: 1800px;
}
</style>
