// pinia独立维护
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 仓库统一导出
// import { useUserStore } from './user'
// export { useUserStore }
export * from './modules/user'
