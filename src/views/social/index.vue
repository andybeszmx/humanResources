<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <template #before>
          本月{{ tips.dateRange }}：社保在缴 {{ tips.socialSecurityCount }} 公积金在缴 {{ tips.providentFundCount }} 增员 {{ tips.newsCount }} 减员 {{ tips.reducesCount }} 入职 {{ tips.worksCount }} 离职 {{ tips.leavesCount }}
        </template>
        <template #after>
          <el-button size="small" type="danger" @click="router.push('/social_securitys/historicalArchiving')">历史归档</el-button>
          <el-button size="small" type="primary" @click="router.push(`/social_securitys/monthStatement?yearMonth=${yearMonth}`)">{{ yearMonth }}报表</el-button>
        </template>
      </page-tools>

      <!-- 筛选组件 -->
      <social-tool @change-select-params="changeSelectParams" />

      <el-card class="hr-block">
        <el-table :data="list" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="username" label="姓名" sortable />
          <el-table-column prop="mobile" label="手机" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="departmentName" label="部门" sortable width="180" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column prop="leaveTime" label="离职时间" sortable />
          <el-table-column :formatter="getCity" prop="participatingInTheCity" label="社保城市" width="180" />
          <el-table-column :formatter="getCity" prop="providentFundCity" label="公积金城市" width="180" />
          <el-table-column :formatter="getBase" prop="socialSecurityBase" label="社保基数" />
          <el-table-column :formatter="getBase" prop="providentFundBase" label="公积金基数" />
          <!-- 操作列可按需启用 -->
          <el-table-column label="操作">
            <template #default="obj">
              <el-button type="text" size="small" @click="router.push(`/social_securitys/detail/${obj.row.id}`)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" align="middle" justify="center" style="height: 60px">
          <el-pagination
            :total="page.total"
            :current-page="page.page"
            :page-size="page.pageSize"
            layout="prev, pager, next"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSettings } from '@/api/social'
import { getEmployeeList } from '@/api/salary'
import SocialTool from './components/social-tool.vue'
import PageTools from './components/page-tools.vue'

const router = useRouter()
const loading = ref(false)
const list = ref([])
const yearMonth = ref('')
const tips = ref({})
const page = reactive({ page: 1, pageSize: 10, total: 0 })
const selectParams = reactive({})

// 模拟随机数据
const getBase = () => {
  return [3000, 5000, 6000, 8000, 10000, 12000, 15000, 16000][Math.floor(Math.random() * 8)]
}
const getCity = () => {
  return ['北京', '上海', '深圳', '天津', '重庆', '珠海', '广州', '西安'][Math.floor(Math.random() * 8)]
}

const fetchSettings = async () => {
  const { dataMonth } = await getSettings()
  yearMonth.value = dataMonth
}

const fetchSocialList = async () => {
  try {
    loading.value = true
    const { rows, total } = await getEmployeeList({ ...page, ...selectParams })
    list.value = rows
    page.total = total
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 接收子组件筛选变化
const changeSelectParams = (params) => {
  selectParams.departmentChecks = params.departmentChecks
  selectParams.providentFundChecks = params.providentFundChecks
  selectParams.socialSecurityChecks = params.socialSecurityChecks
  page.page = 1
  fetchSocialList()
}

const pageChange = (newPage) => {
  page.page = newPage
  fetchSocialList()
}

const handleExport = () => {
  // TODO: 导出功能
}

onMounted(() => {
  fetchSocialList()
  fetchSettings()
})
</script>

<style scoped lang="scss">
.cont-bod-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid #ebeef5;
}
</style>