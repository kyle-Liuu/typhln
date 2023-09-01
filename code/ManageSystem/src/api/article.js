import request from '@/utils/request'

// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')
// 增加文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// 更新文章分类
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)
// 删除文章分类
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })
// 获取文章分类详情
export const artGetChannelsDetailService = (id) =>
  request.get('/my/cate/info', {
    params: { id }
  })

// 获取文章列表
export const artGetArticlesService = (params) =>
  request.get('/my/article/list', {
    params
  })
// 发布文章
// data是formData格式的对象
export const artAddArticleService = (data) =>
  request.post('/my/article/add', data)
// 编辑文章
export const artEditArticleService = (data) =>
  request.put('/my/article/info', data)
// 删除文章
export const artDelArticleService = (id) =>
  request.delete('/my/article/info', {
    params: { id }
  })
// 获取文章详情
export const artGetArticlesDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })
