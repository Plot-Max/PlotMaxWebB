<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { userInfo } from '@/apis'
import MapStateMixins from '@/views/mixins/MapStateMixins';
export default {
  name: 'App',
  mixins: [MapStateMixins],
  watch: {
    $route() {
      if(window.location.pathname != `${process.env.BASE_URL}login` && window.location.pathname != `${process.env.BASE_URL}register` && !this.$store.getters.token) {
        this.$router.push('/login')
      }
    }
  },
  mounted() {
    if(location.pathname !==  `${process.env.BASE_URL}login` && location.pathname !== `${process.env.BASE_URL}register`) {
      userInfo().then(userResp => {
        this.setUserInfo(userResp.data)
      })
    }
    
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: #f5f5f5;
  min-height: 100vh;
}

body {
  margin: 0;
  background: #f5f5f5;
}
</style>
