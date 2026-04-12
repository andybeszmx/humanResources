<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <h2 class="centInfo">{{ $route.params.month }}月人事报表</h2>
        <el-tabs v-model="activeName" class="infoPosin">
          <el-tab-pane name="first">
            <template #label>考勤统计</template>
            <component :is="allList" :show-height="showHeight" :month="$route.params.month" @archiving-report-form="archivingReportForm" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fileUpdate } from '@/api/attendance'
import AllList from './components/refort-list.vue'

const route = useRoute()
const allList = ref('allList')
const activeName = ref('first')
const showHeight = ref(40)

const archivingReportForm = async () => {
  await ElMessageBox.confirm('报表归档将覆盖上一次归档记录，无法恢复。', '归档确认')
  await fileUpdate({ month: route.params.month })
  ElMessage.success('归档报表成功')
}
</script>