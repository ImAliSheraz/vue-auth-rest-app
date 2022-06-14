import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null
  },
  mutations: {
    authUser(state, userData) {
      state.token = userData.token
      state.user = userData.user
    },
    clearAuth(state) {
      state.token = null
      state.user = null
    }
  },
  actions: {
    signup({ commit }, authData) {
      axios.post('http://localhost:8080/register', {
        name: authData.name,
        email: authData.email,
        password: authData.password,
        confpassword: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', res.data.user)
          commit('authUser', {
            token: res.data.token,
            user: res.data.user
          })

          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    login({ commit }, authData) {
      axios.post('http://localhost:8080/login', {
        email: authData.email,
        password: authData.password
      })
        .then(res => {
          console.log(res)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', res.data.user)
          commit('authUser', {
            token: res.data.token,
            user: res.data.user
          })
          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    logout({ commit }) {
      commit('clearAuth')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace('/')
    },
    AutoLogin({ commit }) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const user = localStorage.getItem('user')
      commit('authUser', {
        token: token,
        user: user
      })
    }
  },
  getters: {
    user(state) {
      return state.user
    },
    ifAuthenticated(state) {
      return state.token !== null
    }
  }
})
