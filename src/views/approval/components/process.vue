<template>
  <div class="add-form">
    <el-dialog title="转正审批" v-model="dialogFormVisible">
      <el-form ref="dataFormRef" :model="formData" label-position="right" label-width="100px">
        <el-form-item label="应用：" prop="processType">
          <el-select v-model="formData.processType" class="filter-item" filterable>
            <el-option
              v-for="item in baseData.approvalType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节点：">
          <p><el-button
            size="small"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addTemp"
          >新增节点</el-button></p>
          <div
            v-for="(item, index) in tempList"
            :key="item.key"
            style="border-top:1px solid #ececec;margin-top:10px;"
          >
            <el-form-item label="名称：" style="padding:10px 0;">
              <el-input v-model="item.name" style="width:300px;" />
            </el-form-item>
            <el-form-item label="执行人：">
              <el-select v-model="item.user" class="filter-item" multiple style="width:300px;">
                <el-option
                  v-for="item in Data"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveBtn">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getManagerList } from '@/api/department'
import { process } from '@/api/approvals'
import commonApi from '@/api/constant/approvals'

const props = defineProps(['setData'])
const emit = defineEmits(['handleCloseModal'])

const dialogFormVisible = ref(false)
const activeName = ref('first')
const Data = ref([])
const formData = reactive({
  processType: '',
  points: []
})
const tempList = ref([])
const baseData = commonApi
const dataFormRef = ref(null)

const getEmploySimple = async () => {
  Data.value = await getManagerList()
}

// 弹层显示
const dialogFormV = () => {
  dialogFormVisible.value = true
}

// 弹层隐藏
const dialogFormH = () => {
  dialogFormVisible.value = false
}

// 表单提交
const saveBtn = () => {
  formData.points = []
  for (var i = 0; i < tempList.value.length; i++) {
    var userData = tempList.value[i].user?.join(',') || ''
    var data = {
      name: tempList.value[i].name,
      users: userData
    }
    formData.points.push(data)
  }
  process(formData)
    .then(() => {
      ElMessage.success('流程添加成功！')
      dialogFormVisible.value = false
    })
    .catch(e => {
      ElMessage.error('保存失败！')
    })
}

// 新增一条模板数据
const addTemp = () => {
  if (tempList.value.length < 5) {
    tempList.value = tempList.value || []
    tempList.value.push({
      name: '',
      key: Date.now(),
      user: []
    })
  } else {
    ElMessage.error('节点不能超过5个')
  }
}

// 暴露方法给父组件
defineExpose({
  dialogFormV,
  dialogFormH
})

// 生命周期
getEmploySimple()
</script>

<style rel="stylesheet/scss" lang="scss">
.inputText {
  width: 400px;
  height: 32px;
  resize: none;
  line-height: 22px;
  overflow: hidden;
  font-size: 12px;
  border: 1px solid #dddee1;
  padding: 4px 7px;
  border-radius: 5px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.setInfo {
  label {
    margin-right: 15px;
    padding: 0;
  }
}
.el-checkbox + .el-checkbox {
  margin: 0;
}
</style>