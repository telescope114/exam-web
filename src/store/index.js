import Vue from 'vue'
import Vuex from 'vuex'
import qs from 'qs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user')?qs.parse(localStorage.getItem('user')) : null,
    menus: new Set(),
    studentList: [],
    role: 1
  },
  mutations: {
    setUser (state, payload) {
      // console.log(payload)
      /*state.user = {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token
      }*/
      state.user = payload
      localStorage.setItem('user', qs.stringify(payload))
    },
    setMenu (state, payload){
      if (payload.constructor === Set) {
        state.menus = payload
      } else if (payload.constructor === Array) {
        // state.menus = payload
        for (const item in payload) {
          // console.log(payload[item])
          state.menus.add(payload[item].menuUrl)
        }
      }
      // console.log(payload)
    },
    setStudentList (state, payload) {
      state.studentList = payload
    },
    setRole (state, payload) {
      state.role = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
