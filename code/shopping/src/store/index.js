import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

const state = {}
const getters = {
  token (state) {
    return state.user.userInfo.token
  }
}
const mutations = {}
const actions = {}
const modules = {
  user,
  cart
}

const store = new Vuex.Store({
  modules,
  state,
  getters,
  mutations,
  actions
})

export default store
