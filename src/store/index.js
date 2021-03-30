import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user') || null,
    menus: [],
    studentList: []
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      localStorage.setItem('user', payload)
    },
    setMenu (state, payload){
      state.menus = payload
    },
    setStudentList (state, payload) {
      state.studentList = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
