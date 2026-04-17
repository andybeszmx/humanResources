<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" size="small" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input v-model="userInfo.workNumber" disabled size="small" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 手机 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input
                  v-model="userInfo.mobile"
                  :disabled="!!route.params.id"
                  size="small"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <SelectTree
                  :model-value="userInfo.departmentId"
                  @update:model-value="(val) => userInfo.departmentId = val"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 聘用形式 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" size="small" class="inputW">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  size="small"
                  type="date"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 转正时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userInfo.correctionTime"
                  size="small"
                  type="date"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 员工头像 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <ImageUpload
                  :model-value="userInfo.staffPhoto"
                  @update:model-value="(val) => userInfo.staffPhoto = val"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 保存按钮 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button size="small" type="primary" @click="saveData">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ImageUpload from './components/image-upload.vue'
import SelectTree from './components/select-tree.vue'
import { addEmployee, getEmployeeDetail, updateEmployee } from '@/api/employee'

const route = useRoute()
const router = useRouter()

const userForm = ref(null)

// 表单数据
const userInfo = reactive({
  username: '',
  mobile: '',
  workNumber: '',
  formOfEmployment: undefined,
  departmentId: null,
  timeOfEntry: '',
  correctionTime: '',
  staffPhoto: ''
})

const rules = {
  username: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max: 4, message: '姓名为1-4位' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  formOfEmployment: [
    { required: true, message: '请选择聘用形式', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'blur' }
  ],
  timeOfEntry: [
    { required: true, message: '请选择入职时间', trigger: 'blur' }
  ],
  correctionTime: [
    { required: true, message: '请选择转正时间', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (userInfo.timeOfEntry) {
          if (new Date(userInfo.timeOfEntry) > new Date(value)) {
            callback(new Error('转正时间不能小于入职时间'))
            return
          }
        }
        callback()
      }
    }
  ]
}

// 获取员工详情（编辑模式）
const EmployeeDetail = async () => {
  const data = await getEmployeeDetail(route.params.id)
  Object.assign(userInfo, data)
}

// 保存数据
const saveData = async () => {
  await userForm.value.validate(async (valid) => {
    if (!valid) return
    if (userInfo.timeOfEntry) {
      userInfo.timeOfEntry = new Date(userInfo.timeOfEntry).toISOString().split('T')[0]
    }
    if (userInfo.correctionTime) {
      userInfo.correctionTime = new Date(userInfo.correctionTime).toISOString().split('T')[0]
    }
    try {
      if (route.params.id) {
        // 编辑模式
        await updateEmployee(userInfo)
        ElMessage.success('更新员工成功')
      } else {
        // 新增模式
        await addEmployee(userInfo)
        ElMessage.success('新增员工成功')
      }
      // 跳回员工列表
      router.push('/employee')
    } catch (err) {
      ElMessage.error('操作失败')
    }
  })
}

onMounted(() => {
  if (route.params.id) {
    EmployeeDetail()
  }
})
</script>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px;
  }
}
</style>