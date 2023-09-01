<script setup>
import { ref, nextTick } from 'vue'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artAddArticleService,
  artEditArticleService,
  artGetArticlesDetailService
} from '@/api/article'
import { ElMessage } from 'element-plus'
// 抽屉
const drawerVisible = ref(false)
const Loading = ref(false)
const formRef = ref()
const editorRef = ref()
// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const drawerForm = ref({
  ...defaultForm
})
const drawerRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
  cover_img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}
const emit = defineEmits(['refresh'])
// 提交
const onPublish = async (state) => {
  drawerForm.value.state = state
  await formRef.value.validate()
  const fd = new FormData()
  for (let key in drawerForm.value) {
    fd.append(key, drawerForm.value[key])
  }
  if (drawerForm.value.id) {
    await artEditArticleService(fd)
    ElMessage.success('编辑成功')
    emit('refresh', 'edit')
  } else {
    await artAddArticleService(fd)
    ElMessage.success('发布成功')
    emit('refresh', 'add')
  }
  drawerVisible.value = false
}
const open = async (row) => {
  drawerVisible.value = true
  if (row.id) {
    Loading.value = true
    // 基于row.id去请求数据回显
    const { data } = await artGetArticlesDetailService(row.id)
    drawerForm.value = data.data
    // 此时图片 是网络图片地址
    imgUrl.value = baseURL + drawerForm.value.cover_img
    Loading.value = false
    // 提交给后台时要注意图片必须是file对象格式，因此要进行转换
    const file = await imageUrlToFileObject(
      imgUrl.value,
      drawerForm.value.cover_img
    )
    drawerForm.value.cover_img = file
  } else {
    drawerForm.value = { ...defaultForm }
    nextTick(() => {
      imgUrl.value = ''
      editorRef.value.setHTML('')
    })
  }
}

// 将网络图片地址转换为file对象格式
const imageUrlToFileObject = async (imageUrl, filename) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })

    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })
    return file
  } catch (error) {
    console.error('转换失败', error)
    return null
  }
}

// 图片上传相关
const imgUrl = ref('')

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  return true
}

const handleAvatarChange = (rawFile) => {
  // 预览
  imgUrl.value = URL.createObjectURL(rawFile.raw)
  // 将图片对象存入drawerForm，用于将来的提交
  drawerForm.value.cover_img = rawFile.raw
}

defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="drawerVisible"
    :title="drawerForm.id ? '编辑文章' : '新增文章'"
    size="40%"
  >
    <el-form
      label-width="100px"
      ref="formRef"
      :model="drawerForm"
      :rules="drawerRules"
      v-loading="Loading"
    >
      <el-form-item label="文章标题：" prop="title">
        <el-input
          v-model="drawerForm.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章分类：" prop="cate_id">
        <channel-select
          v-model="drawerForm.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面：" prop="cover_img">
        <!-- 此处只做前端页面展示，发布时再上传
          auto-upload 是否自动上传 默认为 true
            语法：URL.createObjectURL(...) 创建本地预览地址
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChange"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容：" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="drawerForm.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
