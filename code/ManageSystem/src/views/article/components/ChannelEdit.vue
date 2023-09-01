<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({
  cate_name: '',
  cate_alias: ''
})
const formRules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '请输入1-10位非空字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '请输入1-15位字母或数字',
      trigger: 'blur'
    }
  ]
}

// 组件对外暴露一个方法open，基于open传来的参数，区分是添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({...}) => 表单需要渲染(回显)，说明是编辑
// open调用后，可以打开弹层
const open = (row) => {
  // form.value = row
  form.value = { ...row }
  dialogVisible.value = true
  // console.log(form.value)
}

const emit = defineEmits(['refresh'])

const confirm = async () => {
  await formRef.value.validate()
  const isEdit = form.value.id
  if (isEdit) {
    await artEditChannelService(form.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(form.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('refresh')
}

// 向外暴露
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="form.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      :model="form"
      :rules="formRules"
      ref="formRef"
      label-width="100px"
      stylez="padding-right:30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="form.cate_name"
          placeholder="请输入分类名称"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="form.cate_alias"
          placeholder="请输入分类别名"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
