<template>
  <el-cascader
    v-model="innerValue"
    size="small"
    :options="treeData"
    :props="cascaderProps"
    separator="-"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'

// 1. 定义 props（唯一一次声明，改名避免冲突）
const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  }
})

// 2. 定义 emit
const emit = defineEmits(['update:modelValue'])

// 3. 响应式数据
const treeData = ref([])
const innerValue = ref(props.modelValue)

// 4. 级联配置（改名 cascaderProps，避免和 props 变量冲突）
const cascaderProps = ref({
  label: 'name',
  value: 'id'
})

// 5. 监听父组件传值，同步内部状态
watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal
  },
  { immediate: true }
)

// 6. 获取部门树形数据
const getDepartmentData = async () => {
  const res = await getDepartment()
  treeData.value = transListToTreeData(res, 0)
}

// 7. 级联值变化处理
const handleChange = (list) => {
  const val = list.length > 0 ? list[list.length - 1] : null
  emit('update:modelValue', val)
  innerValue.value = val
}

// 8. 生命周期
onMounted(() => {
  getDepartmentData()
})
</script>