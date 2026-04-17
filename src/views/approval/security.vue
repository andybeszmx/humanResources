<template>
  <div class="securitySetting">
    <div class="settingList">
      <div class="set">
        <span>请假</span>
        <span>
          <el-switch
            v-model="levelData.enable"
            active-color="#13ce66"
            :inactive-color="inactiveColor"
            @change="handleChange(levelData,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow('regular')" />
      </div>
      <div class="set">
        <span>加班</span>
        <span>
          <el-switch
            v-model="overtimeData.enable"
            active-color="#13ce66"
            :inactive-color="inactiveColor"
            @change="handleChange(overtimeData,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow('regular')" />
      </div>
      <div class="set">
        <span>离职</span>
        <span>
          <el-switch
            v-model="dimissionData.enable"
            active-color="#13ce66"
            :inactive-color="inactiveColor"
            @change="handleChange(dimissionData,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow('regular')" />
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <span style="text-align:center">
        <el-upload
          class="upload-demo"
          drag
          action="/api/user/process/deploy"
          :headers="myheader"
          :before-upload="beforeUpload"
          :on-error="uploadFail"
          :on-success="handleFileSuccess"
          :show-file-list="false"
          :file-list="fileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处</div>
        </el-upload>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { saveSetState, getFlowList, suspend } from '@/api/approval'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const requestData = ref({})
const activeColor = '#13ce66'
const inactiveColor = '#ccc'
const dialogVisible = ref(false)
const processing = ref(false)
const uploadTip = ref('点击上传')
const fileList = ref([])
const dataBase = ref([])
const levelData = ref({ enable: false })
const overtimeData = ref({ enable: false })
const dimissionData = ref({ enable: false })

const myheader = computed(() => {
  return {
    Authorization: `Bearer ${getToken()}`
  }
})

const getFlow = async () => {
  const data = await getFlowList()
  data.map(item => {
    const items = {
      ...item,
      enable: item.persistentState.suspensionState !== 2
    }
    if (items.key === 'process_leave') {
      levelData.value = items
    } else if (items.key === 'process_dimission') {
      dimissionData.value = items
    } else {
      overtimeData.value = items
    }
  })
}

const handleChange = (obj, e) => {
  if (!obj.key) {
    ElMessage.error('还未上传流程')
    return
  }
  var parent = {
    processKey: obj.key,
    enable: e
  }
  suspend(parent)
}

const changeSet = async () => {
  await saveSetState(requestData.value)
  ElMessage.success('设置保存成功！')
}

const setFlow = (obj) => {
  dialogVisible.value = true
}

const typeTip = (obj) => {
  ElMessage.error(obj)
}

const beforeUpload = (file, obj) => {}

const uploadFail = (err, file, fileList) => {
  uploadTip.value = '点击上传'
  processing.value = false
  ElMessage.error(err)
}

const handleFileSuccess = (obj, file, fileList) => {
  uploadTip.value = '点击上传'
  processing.value = false
  if (obj.code === 99999) {
    ElMessage.error('导入失败!')
  } else {
    ElMessage.success('导入成功!')
    router.back(-1)
  }
}

// 生命周期
getFlow()
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../../styles/variables";
$active: #13ce66;
$inactive: #ccc;
.securitySetting {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  margin: 15px;
  border: 1px solid #ebeef5;
  .settingList {
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      line-height: 40px;
      margin-bottom: 20px;
      border-bottom: solid 1px #ccc;
    }
    .set {
      border: solid 1px #ccc;
      border-radius: 3px;
      padding: 15px 30px 15px 20px;
      position: relative;
      display: inline-block;
      margin-right: 20px;
      span:first-child {
        padding-right: 15px;
        border-right: solid 1px #ccc;
        margin-right: 15px;
      }
      .el-icon-setting {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #999;
      }
    }
  }
}
</style>