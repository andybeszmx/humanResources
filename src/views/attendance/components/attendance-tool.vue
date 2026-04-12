<template>
  <div class="cont-top-box">
    <div class="top-lable">
      <div class="careful-lab">
        <i class="el-icon-info" />有 {{ attendInfo.tobeTaskCount }} 条考勤审批尚未处理
      </div>
      <div class="lable-tit">
        <span class="serachInput">
          <i v-show="iconShow" class="fa fa-search" aria-hidden="true" title="搜索" @click="searchIcon" />
          <el-input
            v-show="searchShow"
            v-model="formData.keyword"
            placeholder="搜索"
            clearable
            @clear="handleClear"
            @keyup.enter="dataSearch"
          />
        </span>
        <router-link :to="{ path: '/employees/import/', query: { name: '考勤' } }" class="el-button el-button--primary el-button--mini" title="导入">导入</router-link>
        <el-badge is-dot class="item">
          <el-button type="primary" size="mini" title="提醒" @click="handleTip">提醒</el-button>
        </el-badge>
        <el-button type="primary" size="mini" title="设置" @click="handleSet">设置</el-button>
        <router-link :to="{ path: '/attendances/archiving/' }" class="el-button el-button--primary el-button--mini" title="历史归档">历史归档</router-link>
        <router-link :to="{ path: '/attendances/report/' + yearMonth }" class="el-button el-button--primary el-button--mini">{{ attendInfo.month }}月份报表</router-link>
      </div>
    </div>
    <component :is="employeesSet" ref="setRef" @handle-close-modal="handleCloseModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import EmployeesSet from './set.vue'

const props = defineProps({
  monthOfReport: [String, Number],
  formData: Object,
  attendInfo: Object,
  yearMonth: String
})

const emit = defineEmits(['dataList'])

const employeesSet = ref('employeesSet')
const dataes = ref('')
const iconShow = ref(true)
const searchShow = ref(false)
const centerDialogVisible = ref(false)
const setRef = ref(null)

const handleSub = () => {
  centerDialogVisible.value = false
  ElMessage.success('提醒成功')
}

const searchIcon = () => {
  iconShow.value = false
  searchShow.value = true
}

const handleClear = () => {
  iconShow.value = true
  searchShow.value = false
  emit('dataList', props.formData)
}

const dataSearch = () => {
  emit('dataList', props.formData)
}

const handleSet = () => {
  setRef.value.dialogFormV()
}

const handleCloseModal = () => {
  setRef.value.dialogFormH()
}
</script>

<style lang="scss" scoped>
.cont-top-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.top-lable {
  position: relative;
  line-height: 2;
  a { margin: 0; }
  .careful-lab {
    i { margin-right: 5px; color: #409eff; }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
  .lable-tit {
    position: absolute;
    right: 0;
    top: 0px;
  }
}
.serachInput .el-input--medium { width: 150px; }
.serachInput .el-input--medium .el-input__inner { height: 26px; line-height: 26px; }
.attenInfo p { line-height: 30px; }
</style>