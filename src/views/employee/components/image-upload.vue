<template>
  <!-- 手动上传配置：action置空 + http-request自定义上传逻辑 -->
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <img v-if="modelValue" :src="modelValue" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { ElMessage, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 定义props（Vue3 组合式API写法）
const props = defineProps({
  modelValue: { // 替换Vue2的value，配合v-model使用
    type: String,
    default: ''
  }
})

// 定义emit（Vue3 父子通信）
const emit = defineEmits(['update:modelValue']) // 用于更新v-model值

// 上传前校验
const beforeAvatarUpload = (file) => {
  const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPEG JPG PNG GIF BMP 格式!')
  }
  if (!isLt5M) {
    ElMessage.error('上传头像图片大小不能超过 5MB!')
  }
  return isJPG && isLt5M
}

// 自定义上传逻辑
const uploadImage = (params) => {
  console.log(params.file)
  // 腾讯云COS上传逻辑可写在这里
  // 上传成功后更新modelValue示例：
  // emit('update:modelValue', '上传后的图片地址')
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>