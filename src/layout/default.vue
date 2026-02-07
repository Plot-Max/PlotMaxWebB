<template>
  <div class="layout-default">
    <component :is="headerComponent" />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import HeaderV2 from "@/components/HeaderV2.vue";

export default {
  name: "DefaultLayout",
  components: {
    Header,
    HeaderV2,
  },
  computed: {
    headerComponent() {
      // return this.$route.path === '/search/v2' ? 'HeaderV2' : 'Header'
      return this.$route.path === "/search/v2" || this.$route.path === "/search"
        ? "HeaderV2"
        : "Header";
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-default {
  background: #f5f5f5;
  min-height: calc(100vh - 80px);
}
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  box-sizing: border-box;
}
/* 搜索页统一间距 24px：与 search 页内两段垂直间距一致 */
.content:has(.search-container) {
  max-width: 1800px;
  padding-top: 24px;
}
</style>
