import Vue from 'vue'
import Vuex from 'vuex'
import qs from 'qs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user')? qs.parse(localStorage.getItem('user')) : null,
    menus: localStorage.getItem('menus')? new Set(JSON.parse(localStorage.getItem('menus'))): new Set(),
    studentList: [],
    role: localStorage.getItem('role')? parseInt(localStorage.getItem('role')):1
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      localStorage.setItem('user', qs.stringify(payload))
    },
    setMenu (state, payload){
      if (payload.constructor === Set) {
        state.menus = payload
      } else if (payload.constructor === Array) {
        for (const item in payload) {
          // console.log(payload)
          state.menus.add(payload[item].menuUrl)
        }
      }
      localStorage.setItem('menus', JSON.stringify(Array.from(state.menus)))
      // const testData = localStorage.getItem('menus')
      // console.log(JSON.parse(testData))
    },
    setStudentList (state, payload) {
      state.studentList = payload
    },
    setRole (state, payload) {
      localStorage.setItem('role', payload)
      state.role = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
