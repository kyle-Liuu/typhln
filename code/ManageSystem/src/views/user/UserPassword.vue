<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const form = ref()
const pwdForm = ref({ old_pwd: '', new_pwd: '', re_pwd: '' })

const validateNewPwd = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同！'))
  } else {
    callback()
  }
}

const validateRePwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码与新密码不一致！'))
  } else {
    callback()
  }
}

const pwdRules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位非空字符',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位非空字符',
      trigger: 'blur'
    },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位非空字符',
      trigger: 'blur'
    },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

const submitForm = async () => {
  const valid = await form.value.validate()
  if (valid) {
    await userUpdatePasswordService(pwdForm.value)
    ElMessage.success('更换密码成功')
    userStore.setToken('')
    userStore.setUser({})
    router.push('/login')
  }
}
const resetForm = () => {
  form.value.resetFields()
}
</script>

<template>
  <page-container title="重置密码">
    <template #default>
      <el-form
        ref="form"
        :model="pwdForm"
        :rules="pwdRules"
        label-width="100px"
        size="large"
        style="width: 50%"
      >
        <el-form-item label="原密码" prop="old_pwd">
          <el-input
            v-model="pwdForm.old_pwd"
            placeholder="请输入原密码"
            type="password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input
            v-model="pwdForm.new_pwd"
            placeholder="请输入新密码"
            type="password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pwd">
          <el-input
            v-model="pwdForm.re_pwd"
            placeholder="请再次输入新密码"
            type="password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">修改密码</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
  </page-container>
</template>
