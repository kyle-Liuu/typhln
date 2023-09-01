<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import PageContainer from '@/components/PageContainer.vue'
import { userUpdateInfoService } from '@/api/user'

// 使用仓库中的初始值，无需响应式
const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()
const form = ref()
const userInfo = ref({ username, nickname, email, id })

const formRules = ref({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称为2到10个非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

const submitForm = async () => {
  // 提交表单逻辑
  await form.value.validate()
  await userUpdateInfoService(userInfo.value)
  // 通知 user模块 更新用户信息
  getUser()
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <template #default>
      <el-form
        ref="form"
        :model="userInfo"
        :rules="formRules"
        label-width="100px"
        size="large"
        style="width: 50%"
      >
        <el-form-item label="登录名称">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </el-form-item>
      </el-form>
    </template>
  </page-container>
</template>
