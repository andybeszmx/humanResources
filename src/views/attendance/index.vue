<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>有 {{ attendInfo.tobeTaskCount }} 条考勤审批尚未处理</template>
        <template v-slot:after>
          <el-button size="mini" type="danger" @click="() => $router.push('/import?type=attendance')">导入</el-button>
          <el-button size="mini" type="warning" @click="handleTip">提醒</el-button>
          <el-button size="mini" type="primary" @click="handleSet">设置</el-button>
          <el-button size="mini" type="default" @click="() => $router.push('/attendances/archiving/')">历史归档</el-button>
          <el-button size="mini" type="primary" @click="() => $router.push({'path':'/attendances/report/'+ yearMonth})">{{ yearMonth }}报表</el-button>
        </template>
      </page-tools>
      <el-card class="hr-block">
        <el-form ref="formData" :model="formData" label-width="120px" class="formInfo">
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.deptID">
              <el-checkbox
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="考勤状态：">
            <el-radio-group v-model="formData.stateID">
              <el-radio
                v-for="item in stateData.holidayType"
                :key="item.id"
                :label="item.value"
              >
                {{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="hr-block">
        <div style="width:100%;position: relative;overflow-x: auto; overflow-y: hidden;">
          <div style="width: 3000px;">
            <table border="0" align="center" cellpadding="0" cellspacing="0" class="tableInfo">
              <tr>
                <th width="50">序号</th>
                <th width="100">姓名</th>
                <th width="100">工号</th>
                <th width="200">部门</th>
                <th width="100">手机</th>
                <th v-for="(it, ind) in monthOfReport" :key="ind" width="110">{{ attendInfo.month }}/{{ ind + 1 }}</th>
              </tr>
              <tr v-for="(item, index) in list" :key="item.id">
                <td width="50">{{ index }}</td>
                <td width="100">{{ item.username }}</td>
                <td width="100">{{ item.workNumber }}</td>
                <td width="200">{{ item.departmentName }}</td>
                <td width="100">{{ item.mobile }}</td>
                <td
                  v-for="(it,ind) in item.attendanceRecord"
                  :key="ind"
                  width="110"
                  @click="() => showChangeDialog(item,ind,it)"
                >
                  <span v-if="it.adtStatu===1">√</span>
                  <span v-if="it.adtStatu===2">旷工</span>
                  <span v-if="it.adtStatu===3">迟到</span>
                  <span v-if="it.adtStatu===4">早退</span>
                  <span v-if="it.adtStatu===5">外出</span>
                  <span v-if="it.adtStatu===6">出差</span>
                  <span v-if="it.adtStatu===7">年假</span>
                  <span v-if="it.adtStatu===8">事假</span>
                  <span v-if="it.adtStatu===9">病假</span>
                  <span v-if="it.adtStatu===10">婚假</span>
                  <span v-if="it.adtStatu===11">丧假</span>
                  <span v-if="it.adtStatu===12">产假</span>
                  <span v-if="it.adtStatu===13">奖励产假</span>
                  <span v-if="it.adtStatu===14">陪产假</span>
                  <span v-if="it.adtStatu===15">探亲假</span>
                  <span v-if="it.adtStatu===16">工伤假</span>
                  <span v-if="it.adtStatu===17">调休</span>
                  <span v-if="it.adtStatu===18">产检假</span>
                  <span v-if="it.adtStatu===19">流产假2</span>
                  <span v-if="it.adtStatu===20">长期病假</span>
                  <span v-if="it.adtStatu===21">测试架</span>
                  <span v-if="it.adtStatu===22">补签</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <el-dialog
          v-model="centerDialogVisible"
          width="30%"
          center
          title=""
        >
          <template #header>
            <div style="color:#fff;">{{ attendInfo.name }} {{ attendInfo.month }}/{{ attendInfo.getDate }}（实际工作日考勤方案）</div>
          </template>
          <div class="attenInfo">
            <p class="colRed">注：统计考勤时，异常状态优先正常状态</p>
            <p class="check">
              <el-radio-group v-model="modifyData.adtStatu">
                <el-radio
                  v-for="item in stateData.vacationtype"
                  :key="item.id"
                  :label="item.id"
                >{{ item.name }}</el-radio>
              </el-radio-group>
            </p>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="btnOK">确定</el-button>
              <el-button @click="centerDialogVisible = false">取消</el-button>
            </div>
          </template>
        </el-dialog>

        <el-row type="flex" align="middle" justify="center" style="height: 60px">
          <el-pagination
            :page-size="page.pagesize"
            :current-page="page.page"
            layout="prev, pager, next"
            :total="page.total"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>

    <el-dialog
      title="提醒"
      v-model="tipsDialogVisible"
      width="280px"
      center
    >
      <div class="attenInfo">
        <p>系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送 1 次。</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSub">我知道了</el-button>
          <el-button @click="tipsDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <attendance-set ref="setRef" @handle-close-modal="handleCloseModal" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getAttendances } from '@/api/attendance'
import AttendanceSet from './components/attendance-set.vue'
import { getDepartment } from '@/api/department'
import PageTools from './components/page-tools.vue'

const router = useRouter()

const list = ref([])
const selectData = ref([])
const stateData = reactive({
  holidayType: [
    { id: '1', value: '正常', isEnable: false },
    { id: '2', value: '旷工', isEnable: false },
    { id: '3', value: '事假', isEnable: false },
    { id: '4', value: '调休', isEnable: false },
    { id: '5', value: '迟到', isEnable: false },
    { id: '6', value: '早退', isEnable: false }
  ],
  vacationtype: [
    { id: '1', name: '正常' }, { id: '2', name: '旷工' }, { id: '3', name: '迟到' },
    { id: '4', name: '早退' }, { id: '5', name: '外出' }, { id: '6', name: '出差' },
    { id: '7', name: '年假' }, { id: '8', name: '事假' }, { id: '9', name: '病假' },
    { id: '10', name: '婚假' }, { id: '11', name: '丧假' }, { id: '12', name: '产假' },
    { id: '13', name: '奖励产假' }, { id: '14', name: '陪产假' }, { id: '15', name: '探亲假' },
    { id: '16', name: '工伤假' }, { id: '17', name: '调休' }, { id: '18', name: '产检假' },
    { id: '19', name: '流产假' }, { id: '20', name: '长期病假' }, { id: '21', name: '测试假' },
    { id: '22', name: '补签' }
  ],
  type: [
    { leaveType: '60000', name: '年假', isEnable: false },
    { leaveType: '60100', name: '事假', isEnable: false },
    { leaveType: '60200', name: '病假', isEnable: false },
    { leaveType: '60300', name: '婚假', isEnable: false },
    { leaveType: '60400', name: '丧假', isEnable: false },
    { leaveType: '60500', name: '产假', isEnable: false },
    { leaveType: '60600', name: '奖励产假', isEnable: false },
    { leaveType: '60700', name: '陪产假', isEnable: false },
    { leaveType: '60800', name: '探亲假', isEnable: false },
    { leaveType: '60900', name: '工伤假', isEnable: false },
    { leaveType: '61000', name: '调休假', isEnable: false },
    { leaveType: '61100', name: '产检假', isEnable: false },
    { leaveType: '61200', name: '流产假', isEnable: false },
    { leaveType: '61300', name: '长期病假', isEnable: false },
    { leaveType: '61400', name: '测试假', isEnable: false }
  ],
  departmentType: [
    { dedTypeCode: '51000', name: '迟到扣款', isEnable: false, departmentId: '', periodLowerLimit: '30', periodUpperLimit: '30', timesLowerLimit: '2', timesUpperLimit: '2', dedAmonutLowerLimit: '30', dedAmonutUpperLimit: '0', absenceDays: '0.5', fineSalaryMultiples: '2', absenceTimesUpperLimt: '0' },
    { dedTypeCode: '52000', name: '早退扣款', isEnable: false, departmentId: '', periodLowerLimit: '30', periodUpperLimit: '30', timesLowerLimit: '2', timesUpperLimit: '2', dedAmonutLowerLimit: '30', dedAmonutUpperLimit: '0', absenceDays: '0.5', fineSalaryMultiples: '2', absenceTimesUpperLimt: '0' },
    { dedTypeCode: '53000', name: '旷工扣款', isEnable: false, departmentId: '', periodLowerLimit: '30', periodUpperLimit: '30', timesLowerLimit: '2', timesUpperLimit: '2', dedAmonutLowerLimit: '30', dedAmonutUpperLimit: '0', absenceDays: '0.5', fineSalaryMultiples: '2', absenceTimesUpperLimt: '0' }
  ],
  overtimeType: [
    { departmentId: '', rule: '工作日可申请加班', ruleStartTime: '', ruleEndTime: '', isTimeOff: false, isEnable: false },
    { departmentId: '', rule: '休息日可申请加班', ruleStartTime: '', ruleEndTime: '', isTimeOff: false, isEnable: false },
    { departmentId: '', rule: '法定节假日可申请加班', ruleStartTime: '', ruleEndTime: '', isTimeOff: false, isEnable: false }
  ]
})

const departments = ref([])
const total = ref(100)
const attendanceRecord = ref('')
const monthOfReport = ref('')
const centerDialogVisible = ref(false)
const tipsDialogVisible = ref(false)
const month = ref('')
const yearMonth = ref('')
const loading = ref(false)
const attendInfo = reactive({
  month: '',
  getDate: '',
  getInfo: '',
  name: '',
  counts: '',
  tobeTaskCount: ''
})

const formData = reactive({
  page: 1,
  pagesize: 10,
  keyword: '',
  deptID: [],
  stateID: ''
})

const page = reactive({
  page: 1,
  pagesize: 10,
  total: 0
})

const modifyData = reactive({
  userId: '',
  day: '',
  adtStatu: ''
})

const setRef = ref(null)

const handleSub = () => {
  tipsDialogVisible.value = false
  ElMessage.success('提醒成功')
}

const handleTip = () => {
  tipsDialogVisible.value = true
}

const handleSet = () => {
  setRef.value.dialogFormV()
}

const handleCloseModal = () => {
  setRef.value.dialogFormH()
}

const getDepartmentList = async () => {
  departments.value = await getDepartment()
}

const getAttendancesList = async () => {
  loading.value = true
  const { data, monthOfReport: resMonth, tobeTaskCount } = await getAttendances({ ...page })
  list.value = data.rows
  page.total = data.total
  attendInfo.counts = data.total
  attendInfo.month = resMonth
  attendInfo.tobeTaskCount = tobeTaskCount

  const date = new Date()
  const year = date.getFullYear()
  const m = resMonth
  const d = new Date(year, m, 0)
  monthOfReport.value = d.getDate()
  yearMonth.value = year + ('' + m < 10 ? '0' + m : m)
  month.value = resMonth
  loading.value = false
}

const btnOK = async () => {
  ElMessage.success('更新成功')
  centerDialogVisible.value = false
  getAttendancesList()
}

const pageChange = (newPage) => {
  page.page = newPage
  getAttendancesList()
}

const showChangeDialog = (item, id, it) => {
  modifyData.userId = item.id
  modifyData.day = it.day
  modifyData.departmentId = item.departmentId
  modifyData.adtStatu = it.adtStatu + ''

  if (it.adtStatu !== '') {
    attendInfo.getDate = parseInt(id + 1)
    attendInfo.getInfo = it.adtStatu
    attendInfo.name = item.name
    centerDialogVisible.value = true
  }
}

onMounted(() => {
  getAttendancesList()
  getDepartmentList()
})
</script>

<style lang="scss" scoped>
.tableInfo {
  line-height: 36px;
  border: solid 1px #ebeef5;
  border-right: 0 none;
  border-bottom: 0 none;
  tr {
    th {
      height: 50px;
      text-align: center;
      border-right: solid 1px #ebeef5;
      border-bottom: solid 1px #ebeef5;
      border-bottom: 2px solid #e8e8e8;
      background: #fafafa;
      min-width: 100px;
    }
    td {
      height: 36px;
      text-align: center;
      border-right: solid 1px #ebeef5;
      border-bottom: solid 1px #ebeef5;
    }
  }
}

.attenInfo {
  p {
    &.check {
      padding: 20px 0 0;
    }
    .el-radio {
      display: inline-block;
      width: 60px;
      padding: 5px 0;
    }
  }
}
</style>