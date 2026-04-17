<template>
  <el-dialog 
    align-center
    :model-value="showDialog" 
    @update:model-value="close"
    :title="showTitle"
    @close="close">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>

      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>

      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%" />
      </el-form-item>

      <el-form-item>
        <el-row style="width: 100%; text-align: center;">
          <el-col :span="16">
            <el-button size="mini" type="primary" @click="btnOK">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'

// 父组件传参
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  currentNodeId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:showDialog', 'updateDepartment'])

const addDept = ref(null)

const managerList = ref([])

const formData = reactive({
  code: '',
  introduce: '',
  managerId: '',
  name: '',
  pid: ''
})

const showTitle = computed(() => formData.id ? '编辑部门' : '新增部门')

// 表单校验规则
const rules = reactive({
  code: [
    { required: true, message: '部门编码不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '部门编码长度为2-10个字符', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: async (rule, value, callback) => {
        const result = await getDepartment()
        const filterList = formData.id ? result.filter(item => item.id !== formData.id) : result
        if (filterList.some(item => item.code === value)) {
          callback(new Error('部门编码已存在'))
        } else {
          callback()
        }
      }
    }
  ],
  introduce: [
    { required: true, message: '部门介绍不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '长度为 1-100 个字符', trigger: 'blur' }
  ],
  managerId: [
    { required: true, message: '部门负责人不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '长度为 2-10 个字符', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: async (rule, value, callback) => {
        const result = await getDepartment()
        const filterList = formData.id ? result.filter(item => item.id !== formData.id) : result
        if (filterList.some(item => item.name === value)) {
          callback(new Error('部门名称已存在'))
        } else {
          callback()
        }
      }
    }
  ]
})

// 获取负责人列表
const loadManagerList = async () => {
  managerList.value = await getManagerList()
}

// 关闭弹窗 + 重置
const close = () => {
  formData.code = ''
  formData.introduce = ''
  formData.managerId = ''
  formData.name = ''
  formData.pid = ''
  formData.id = null

  addDept.value?.resetFields()
  emit('update:showDialog', false)
}

// 确定提交
const btnOK = async () => {
  await addDept.value.validate(async (isOK) => {
    if (!isOK) return

    let msg = '新增'
    if (formData.id) {
      await updateDepartment(formData)
      msg = '修改'
    } else {
      await addDepartment({ ...formData, pid: props.currentNodeId })
    }

    ElMessage.success(`${msg}部门成功`)
    emit('updateDepartment')
    close()
  })
}

// 获取详情（编辑用）
const getDetail = async () => {
  const data = await getDepartmentDetail(props.currentNodeId)
  Object.assign(formData, data)
}
defineExpose({
  getDetail   // 把方法暴露出去
})

// 初始化加载
onMounted(() => {
  loadManagerList()
})
</script>

<style scoped>
</style>