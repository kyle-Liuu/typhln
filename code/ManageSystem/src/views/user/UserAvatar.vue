<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { ElMessage } from 'element-plus'

const uploadRef = ref()
const {
  user: { user_pic },
  getUser
} = useUserStore()
const imgUrl = ref(user_pic)

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  return true
}
const handleAvatarChange = (rawFile) => {
  // 基于 FileReader 获取图片的base64数据
  const reader = new FileReader()
  reader.readAsDataURL(rawFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const uploadImg = async () => {
  await userUpdateAvatarService(imgUrl.value)
  getUser()
  ElMessage.success('头像已更新')
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-change="handleAvatarChange"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <img v-else src="@/assets/avatar.jpg" style="width: 278px" />
    </el-upload>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
    >
      选择图片
    </el-button>
    <el-button @click="uploadImg" type="success" :icon="Upload" size="large">
      上传头像
    </el-button>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
