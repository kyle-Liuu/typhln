import request from '@/utils/request'

// 订单结算
// mode: cart => obj { cartIds }
// mode: buyNow => obj { goodsId, goodsNum, goodsSkuId }
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      delivery: 10, // 10快递配送，20自取
      payType: 10,
      couponId: 0,
      isUsePoints: 0,
      mode, // cart购物车结算, buyNow立即购买
      ...obj
    }
  })
}

// 提交订单
export const submitOrder = (mode, params) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 物流方式  配送方式 (10快递配送 20门店自提)
    couponId: 0, // 优惠券 id
    payType: 10, // 余额支付
    isUsePoints: 0, // 是否使用积分
    ...params
  })
}

// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
