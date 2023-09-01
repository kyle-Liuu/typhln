<script setup>
import { userRegiserService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const remChecked = ref(JSON.parse(localStorage.getItem('remChecked')) || false)
const isRegister = ref(false)
const router = useRouter()
const userStore = useUserStore()
const form = ref()
// 注册&&登录
// form数据对象
const formModel = ref({
  username: JSON.parse(localStorage.getItem('username')) || '',
  password: JSON.parse(localStorage.getItem('pwd')) || '',
  repassword: ''
})
// 校验规则
const rules = {
  username: [
    // 非空校验，消息提示，触发时机
    // 长度校验 min max
    // 正则校验 pattern
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '5-10位大小写字母和数字', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9]{5,10}$/,
      message: '请输入5-10位大小写字母和数字',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    // 自定义校验 validator: (rule, value, callback) => {...}
    // rule 当前校验规则相关信息
    // value 当前校验的表单元素的值
    // callback 回调函数 无论成功或失败都需要 callback 回调
    //    1. callback()，表示校验通过
    //    2. callback(new Error('...'))，表示校验失败并报错
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
// 注册前的预校验
const register = async () => {
  await form.value.validate()
  await userRegiserService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}
// 切换的时候重置表单内容
watch(isRegister, () => {
  localStorage.removeItem('username')
  localStorage.removeItem('pwd')
  localStorage.removeItem('remChecked')
  remChecked.value = false
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
// 登录前的预校验
const login = async () => {
  await form.value.validate()
  const {
    data: { token }
  } = await userLoginService(formModel.value)
  // 保存token到Pinia
  userStore.setToken(token)
  ElMessage.success('登录成功')
  if (remChecked.value) {
    // 本地存储用户名和密码
    localStorage.setItem('username', JSON.stringify(formModel.value.username))
    localStorage.setItem('pwd', JSON.stringify(formModel.value.password))
    localStorage.setItem('remChecked', JSON.stringify(remChecked.value))
  } else {
    // 移除本地存储的用户名和密码
    localStorage.removeItem('username')
    localStorage.removeItem('pwd')
    localStorage.removeItem('remChecked')
  }
  // 跳转到首页
  router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        :model="formModel"
        :rules="rules"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="formModel.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录 -->
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="remChecked"> 记住我 </el-checkbox>
            <!-- <el-link type="primary" :underline="false">忘记密码？</el-link> -->
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
