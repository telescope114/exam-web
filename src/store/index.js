import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user') || null,
    menus: new Set(),
    studentList: [],
    role: 1
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      localStorage.setItem('user', payload)
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
