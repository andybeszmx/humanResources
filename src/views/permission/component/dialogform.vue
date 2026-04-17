<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPermissionList, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'

// 父组件传参
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  currentId: {
    type: Number,
    default: null
  },
  editId: {
    type: Number,
    default: null
  }
})

// 事件发射
const emit = defineEmits(['update:dialogVisible', 'updatePermissionList', 'update:currentId', 'update:editId'])

// 表单ref
const permissionForm = ref(null)

// 表单数据
const permissionData = ref({
  name: '',
  code: '',
  description: '',
  type: 1,
  pid: 0,
  enVisible: 0
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '权限名称不能为空', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: async (rule, value, callback) => {
        const result = await getPermissionList()
        // 编辑时排除自身
        const filterList = permissionData.value.id 
          ? result.filter(item => item.id !== permissionData.value.id) 
          : result
        if (filterList.some(item => item.name === value)) {
          callback(new Error('已经有该名称了'))
        } else {
          callback()
        }
      }
    }
  ],
  code: [
    { required: true, message: '权限标识不能为空', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: async (rule, value, callback) => {
        const result = await getPermissionList()
        const filterList = permissionData.value.id 
          ? result.filter(item => item.id !== permissionData.value.id) 
          : result
        if (filterList.some(item => item.code === value)) {
          callback(new Error('已经有该标识了'))
        } else {
          callback()
        }
      }
    }
  ],
  description: [{ required: true, message: '权限描述不能为空', trigger: 'blur' }]
}

// 监听弹窗打开，编辑模式回显数据
watch(
  () => props.dialogVisible,
  async (newVal) => {
    if (newVal && props.editId) {
      const data = await getPermissionDetail(props.editId)
      permissionData.value = data
    }
  },
  { immediate: true }
)

// 确定按钮
const btnOK = async () => {
  await permissionForm.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (props.currentId) {
        // 添加子权限
        permissionData.value.pid = props.currentId
        permissionData.value.type = 2
        await addPermission(permissionData.value)
        ElMessage.success('新增权限成功')
      } else if (props.editId) {
        // 编辑权限
        await updatePermission(permissionData.value)
        ElMessage.success('修改权限成功')
      } else {
        // 添加根权限
        await addPermission(permissionData.value)
        ElMessage.success('新增权限成功')
      }
      // 通知父组件刷新列表
      emit('updatePermissionList')
      // 关闭弹窗
      btnCancel()
    } catch (err) {
      ElMessage.error('操作失败')
    }
  })
}

// 取消按钮
const btnCancel = () => {
  // 重置表单
  permissionData.value = {
    name: '',
    code: '',
    description: '',
    type: 1,
    pid: 0,
    enVisible: 0
  }
  permissionForm.value?.resetFields()
  // 通知父组件重置状态、关闭弹窗
  emit('update:currentId', null)
  emit('update:editId', null)
  emit('update:dialogVisible', false)
}
</script>

<template>
  <el-dialog
    :model-value="props.dialogVisible"
    @update:model-value="(val) => emit('update:dialogVisible', val)"
    title="提示"
    width="500px"
    @close="btnCancel"
  >
    <el-form ref="permissionForm" :model="permissionData" :rules="rules">
      <el-form-item prop="name" label="权限名称">
        <el-input v-model="permissionData.name" size="small" />
      </el-form-item>
      <el-form-item prop="code" label="权限标识">
        <el-input v-model="permissionData.code" size="small" />
      </el-form-item>
      <el-form-item prop="description" label="权限描述">
        <el-input v-model="permissionData.description" size="small" type="textarea" />
      </el-form-item>
      <el-form-item prop="enVisible" label="开启">
        <el-switch v-model="permissionData.enVisible" :active-value="1" :inactive-value="0" size="small" />
      </el-form-item>
      <el-form-item>
        <el-row style="width: 100%; text-align: center;">
          <el-col>
            <el-button type="primary" @click="btnOK">确定</el-button>
            <el-button @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>