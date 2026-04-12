<template>
  <div class="boxInfo">
    <div class="fr clearfix searchInfo">
      <a class="el-button fr el-button--primary el-button--mini" title="导出" @click="handelFileDownload">导出</a>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%; margin-top:10px;"
      border
    >
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="workNumber" label="工号" width="100" />
      <el-table-column prop="mobile" label="手机号" width="200" />
      <el-table-column prop="department" label="部门" width="200" />
      <el-table-column prop="leaveDays" label="事假" width="100" />
      <el-table-column prop="dayOffLeaveDays" label="调休" width="100" />
      <el-table-column prop="normalDays" label="正常" width="100" />
      <el-table-column prop="laterTimes" label="迟到次数" width="100" />
      <el-table-column prop="earlyTimes" label="早退次数" width="100" />
      <el-table-column prop="averageDailyNaturalDays" label="日均时长" width="150" />
      <el-table-column prop="absenceDays" label="旷工天数" width="100" />
      <el-table-column prop="whetherItIsFullOfWork" label="是否全勤" width="100" />
      <el-table-column prop="actualAttendanceDaysAreOfficial" label="实际出勤天数" width="180" />
      <el-table-column prop="attendanceDay" label="应出勤工作日" width="120" />
      <el-table-column prop="salaryStandard" label="计薪标准" width="100" />
      <el-table-column prop="officialSalaryDays" label="计薪天数" width="150" />
    </el-table>

    <div class="pagination">
      <el-pagination
        :page-size="requestParameters.pagesize"
        layout="total, prev, pager, next"
        :total="Number(counts)"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <div class="butList">
      <el-tooltip effect="dark" content="将当前报表存放至归档，归档可以多次，但只保留最后一次" placement="top-start">
        <el-button type="primary" size="small" @click="archivingReportForm">归档{{ month }}月份报表</el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="开始做下月考勤" placement="top-start">
        <el-button type="primary" size="small" @click="createReportForm">新建报表</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { archives, newReports, reportForm } from '@/api/attendance'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['archivingReportForm'])

const dataList = ref([])
const seleList = ref([])
const tableKey = ref(0)
const counts = ref('')
const loading = ref(false)
const month = ref(route.params.month)

const requestParameters = reactive({
  atteDate: '',
  keyword: '',
  page: 1,
  pagesize: 10
})

const list = computed(() => {
  const search = requestParameters.keyword
  if (!search) return dataList.value
  return dataList.value.filter(item => {
    return Object.keys(item).some(key => String(item[key]).toLowerCase().includes(search.toLowerCase()))
  })
})

const reportFormList = async () => {
  loading.value = true
  dataList.value = await reportForm(requestParameters)
  loading.value = false
}

const archivingReportForm = async () => {
  await ElMessageBox.confirm('该月报表已归档过，重新归档将覆盖上一份报表，您确认要再次归档吗？', `归档${month.value}报表`)
  await archives({ departmentId: requestParameters.departmentId, atteDate: month.value })
  ElMessage.success('归档成功')
  emit('archivingReportForm')
}

const getNextMonth = (date) => {
  const arr = date.split('-')
  let year = arr[0]
  let month = parseInt(arr[1])
  let year2 = year
  let month2 = month + 1
  if (month2 === 13) {
    year2++
    month2 = 1
  }
  if (month2 < 10) month2 = '0' + month2
  return { datas: year2 + '-' + month2, months: month2 }
}

const createReportForm = async () => {
  await ElMessageBox.confirm(`新建报表会使得${month.value}月报表不能修改，且您上一次归档之后的修改将不会被保存。您确定现在就开始做下月考勤吗？`, `新建${parseInt(month.value) + 1}报表`)
  const atteTime = month.value.substring(0, 4) + '-' + month.value.substring(4)
  const next = getNextMonth(atteTime).datas.replace('-', '')
  requestParameters.yearMonth = next
  await newReports(requestParameters)
  ElMessage.success('新建报表成功！')
  router.push('/attendances')
}

const handleSizeChange = (pageSize) => {
  requestParameters.pagesize = pageSize
  if (requestParameters.page === 1) reportFormList()
}

const handleCurrentChange = (val) => {
  requestParameters.page = val
  reportFormList()
}

const handelFileDownload = () => {
  try {
    ElMessage.success('导出报表成功！')
  } catch (e) {
    ElMessage.error(e.message)
  }
}

onMounted(() => {
  requestParameters.atteDate = month.value
  reportFormList()
})
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.butList {
  margin-top: 15px;
  text-align: center;
  background: #fff;
  span {
    display: inline-block;
    background: $green;
    color: #fff;
    padding: 8px 20px;
    border-radius: 3px;
    margin: 10px;
    cursor: pointer;
  }
  .cancel {
    background: #ccc;
    color: #666;
  }
}
</style>