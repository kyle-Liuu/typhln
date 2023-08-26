import { getCartList, changeCount, delSelect } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    SET_CARTLIST (state, list) {
      state.cartList = list
    },
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    async getCartAction (context) {
      const { data: { list } } = await getCartList()
      // 手动维护数据，添加一个isCkecked属性，用来标记当前商品是否选中，默认为 true
      list.forEach(item => { item.isChecked = true })
      context.commit('SET_CARTLIST', list)
    },
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先修改本地
      context.commit('changeCount', { goodsId, goodsNum })
      // 再同步到后台
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },
    async dalSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      // console.log(cartIds)
      await delSelect(cartIds)

      // 重新拉取最新的购物车数据(重新渲染)
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 所有商品总数
    cartTotal (state) {
      return state.cartList.reduce((total, item) => total + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的商品总数
    selCount (state, getters) {
      return getters.selCartList.reduce((total, item) => total + item.goods_num, 0)
    },
    // 选中的商品总价格
    selPrice (state, getters) {
      return getters.selCartList.reduce((total, item) => total + item.goods.goods_price_min * item.goods_num, 0)
    },
    // 全选功能
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
