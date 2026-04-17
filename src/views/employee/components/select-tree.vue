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

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const treeData = ref([])
const innerValue = ref(props.modelValue)

const cascaderProps = ref({
  label: 'name',
  value: 'id'
})

//监听父组件传值，同步内部状态
watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal
  },
  { immediate: true }
)

// 获取部门树形数据
const getDepartmentData = async () => {
  const res = await getDepartment()
  treeData.value = transListToTreeData(res, 0)
}

// 级联值变化处理
const handleChange = (list) => {
  const val = list.length > 0 ? list[list.length - 1] : null
  emit('update:modelValue', val)
  innerValue.value = val
}

onMounted(() => {
  getDepartmentData()
})
</script>