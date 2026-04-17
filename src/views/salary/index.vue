<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 前面内容 -->
        <template v-slot:before>{{ tipsInfo }}</template>
        <template v-slot:after>
          <el-button size="small" type="danger" @click="$router.push('/salarys/setting')">设置</el-button>
          <el-button size="small" type="primary" @click="$router.push(`/salarys/monthStatement?yearMonth=${yearMonth}`)">{{ yearMonth }}报表</el-button>
        </template>
      </page-tools>
      <!-- 条件筛选 -->
      <el-card class="hr-block">
        <el-form label-width="120px">
          <el-form-item label="聘用形式:">
            <el-checkbox-group v-model="formData.approvalsTypeChecks">
              <el-checkbox
                v-for="item in approvalsType"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="员工状态:">
            <el-checkbox-group v-model="formData.approvalsStateChecks">
              <el-checkbox
                v-for="item in approvalsState"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.departmentChecks">
              <el-checkbox
                v-for="item in departments"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="hr-block">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机" />
          <el-table-column prop="workNumber" label="工号" />
          <el-table-column prop="formOfEmployment" :formatter="formatEmployment" width="100" label="聘用形式" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" width="130" label="入职时间">
            <span>{{ new Date("2021-10-22").toLocaleDateString() }}</span>
          </el-table-column>
          <el-table-column :formatter="getMoney" label="工资基数" />
          <el-table-column label="津贴方案" width="100">通用方案</el-table-column>
          <el-table-column label="操作" width="260">
            <template v-slot="scope">
              <el-button
                v-if="scope.row.currentBasicSalary + scope.row.currentPostWage > 0"
                size="small"
                type="primary"
                @click="changeSalary(scope.row.id)"
              >调薪</el-button>
              <el-button
                v-else
                size="small"
                type="danger"
                @click="fixedSalary( scope.row.id)"
              >定薪</el-button>
              <el-button link size="small">
                <router-link :to="`/salarys/details/${yearMonth}/${scope.row.id}`">查看</router-link>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" style="height: 50px" align="middle">
          <el-pagination
            background
            layout="prev,pager,next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.pageSize"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!--查看弹框-->
      <el-dialog :title="topLabel" v-model="centerDialogVisible" width="50%" left>
        <component 
        :is="currentComponent" 
        :user-salary="selectedSalaryInfo" 
        :user-id="selectUserId" 
        @onDialogCancel="centerDialogVisible = false" />
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTips, getSalaryDetail, getCompanySetting } from '@/api/salary'
import { getDepartment } from '@/api/department'
import { getEmployeeList } from '@/api/salary'
import ChangeSalary from './components/change-salary.vue'
import FixedSalary from './components/fixed-salary.vue'
import pageTools from './components/page-tools.vue'

const router = useRouter()

// 数据
const seeState = ref('')
const centerDialogVisible = ref(false)
const topLabel = ref('转正')
const approvalsType = ref([
  { id: 1, value: '正式' },
  { id: 2, value: '非正式' }
])
const approvalsState = ref([
  { id: '1', value: '在职' },
  { id: '2', value: '离职' }
])
const department = ref([])
const subsidyScheme = ref([])
const list = ref([])
const departments = ref([])
const loading = ref(false)
const page = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})
const tips = ref({})
const yearMonth = ref('')
const formData = reactive({
  approvalsTypeChecks: [],
  approvalsStateChecks: [],
  departmentChecks: []
})
const selectedSalaryInfo = ref({})
const selectUserId = ref(null)
const currentComponent = ref(null)

// 计算属性
const tipsInfo = computed(() => {
  // return `本月${tips.value.dateRange}：入职 ${tips.value.worksCount} 离职 ${tips.value.leavesCount} 调薪 ${tips.value.adjustCount} 未定薪 ${tips.value.unGradingCount}`
  return `本月0：入职 0 离职 0 调薪 0 未定薪 0`
})

// 方法
const getMoney = () => {
  return [3000, 5000, 6000, 8000, 10000, 12000, 15000, 16000][Math.floor(Math.random() * 8)]
}

const formatEmployment = (row) => {
  const data = approvalsType.value.find(item => item.id === row.formOfEmployment.toString())
  return data ? data.value : '未知'
}

const getEmployeeListData = async () => {
  const data = await getCompanySetting()
  yearMonth.value = data.dataMonth
  loading.value = true
  const { rows, total } = await getEmployeeList({ ...page, ...formData })
  list.value = rows
  page.total = total
  loading.value = false
  // getTipsData(yearMonth.value)
}

const getDepartmentList = async () => {
  departments.value = await getDepartment()
}

const getTipsData = async (yearMonth) => {
  const { tipsRes } = await getTips(yearMonth)
  tips.value = tipsRes
}

const changePage = (newPage) => {
  page.page = newPage
  getEmployeeListData()
}

const changeSalary = async (userId) => {
  topLabel.value = '调薪'
  currentComponent.value = ChangeSalary
  centerDialogVisible.value = true
  selectUserId.value = userId
  selectedSalaryInfo.value = await getSalaryDetail(userId)
}

const fixedSalary = (userId) => {
  topLabel.value = '定薪'
  currentComponent.value = FixedSalary
  selectUserId.value = userId
  centerDialogVisible.value = true
}

const changeParams = () => {
  page.page = 1
  getEmployeeListData()
}

// 生命周期
onMounted(() => {
  getEmployeeListData()
  getDepartmentList()
})
</script>