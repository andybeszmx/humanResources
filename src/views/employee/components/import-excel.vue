<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    title="员工导入"
    @close="closeDialog"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excelUploadInput"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        />
        <div class="drop">
          <el-icon :size="60" color="#c0c4cc">
            <Upload />
          </el-icon>
          <el-button link @click="getTemplate">下载导入模板</el-button>
          <span>
            将文件拖到此处或
            <el-button link @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end" style="padding: 0 20px 20px;">
      <el-button size="small" type="primary" @click="closeDialog">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { getExportTemplate, uploadExcel } from '@/api/employee'
import FileSaver from 'file-saver'

const props = defineProps({
  showExcelDialog: {
    type: Boolean,
    default: false
  }
})

// 事件发射
const emit = defineEmits(['update:showExcelDialog', 'uploadSuccess'])

const dialogVisible = ref(false)

// 监听 props 变化，同步到本地状态
watch(
  () => props.showExcelDialog,
  (val) => {
    dialogVisible.value = val
  },
  { immediate: true }
)

// 文件输入框
const excelUploadInput = ref(null)

// 下载导入模板
const getTemplate = async () => {
  const data = await getExportTemplate()
  FileSaver.saveAs(data, '员工导入模版.xlsx')
}

// 触发文件选择
const handleUpload = () => {
  excelUploadInput.value?.click()
}

// 文件选择变化
const uploadChange = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    const formData = new FormData()
    formData.append('file', files[0])
    try {
      await uploadExcel(formData)
      ElMessage.success('导入成功')
      emit('uploadSuccess')
      closeDialog()
    } catch (error) {
      ElMessage.error('导入失败')
    } finally {
      // 清空输入框，允许重复上传
      if (excelUploadInput.value) {
        excelUploadInput.value.value = ''
      }
    }
  }
}

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
  emit('update:showExcelDialog', false)
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;
  
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 40px;
    color: #bbb;
  }
}
</style>