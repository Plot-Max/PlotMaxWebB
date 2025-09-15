import Vue from 'vue'
import Vuex from 'vuex'

import {userInfo} from '@/apis'

Vue.use(Vuex)
const _vm = new Vue()

export default new Vuex.Store({
  state: {
    Authorization: localStorage.getItem("Authorization")
      ? localStorage.getItem("Authorization")
      : "",
    userInfo: null,
    rememberMe: localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : 'false',
    username: localStorage.getItem("username") ? localStorage.getItem("username") : null,
  },
  getters: {
    token(state) {
      return state.Authorization
    },
    userInfo(state) {
      return state.userInfo||{}
    },
  },
  mutations: {
    changeLogin(state, user) {
      if(user) {
        state.Authorization = `Bearer ${user.Authorization}`;
        localStorage.setItem("Authorization", `Bearer ${user.Authorization}`);
      }
      else{
        state.Authorization = '';
        state.userInfo = null;
        localStorage.removeItem("Authorization");
      }
    },
    refreshUserInfo(state) {
      if(!state.userInfo) return
      userInfo().then(resp=>{
        if(resp.data) {
          state.userInfo = resp.data
        }
      })
    },
    setUserInfo(state, userInfo) {
      if(userInfo) state.userInfo = userInfo
    },
    setRememberMe(state, rememberMe) {
      state.rememberMe = rememberMe
      if(rememberMe) {
        localStorage.setItem("rememberMe", rememberMe)
      }
      else {
        localStorage.removeItem("rememberMe")
      }
    },
    setUsername(state, username) {
      state.username = username
      if(state.rememberMe) {
        localStorage.setItem("username", username)
      }
      else {
        localStorage.removeItem("username")
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
