import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人权证相关
      userInfo: getInfo()
    }
  },
  getters: {},
  actions: {
    logout (context) {
      // 重置个人信息
      context.commit('setUserInfo', {})
      // 重置购物车 跨模块调用mutation——'cart/setCartList' => { root: true }（全局）
      context.commit('cart/SET_CARTLIST', [], { root: true })
    }
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload
      // 持久化处理
      setInfo(payload)
    }
  }
}
