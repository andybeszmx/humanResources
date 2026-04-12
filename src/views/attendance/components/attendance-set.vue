<template>
  <div class="add-form">
    <el-dialog title="设置" v-model="dialogFormVisible">
      <el-tabs v-model="activeName" style="margin-left:20px" @tab-click="handleClick">
        <el-tab-pane label="出勤设置" name="first">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="formBase"
            label-position="right"
            label-width="100px"
            style="width:700px;"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select v-model="formBase.departmentId" placeholder="请选择" @change="handleChange">
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出勤时间：" prop="morningStartTime">
              <el-time-select
                v-model="formBase.morningStartTime"
                :picker-options="{ start: '00:00', step: '00:05', end: '23:59' }"
                class="timePicker"
              />-
              <el-time-select
                v-model="formBase.morningEndTime"
                :picker-options="{ start: '08:30', step: '00:15', end: '18:30' }"
                class="timePicker"
              />
              <el-time-select
                v-model="formBase.afternoonStartTime"
                :picker-options="{ start: '08:30', step: '00:15', end: '18:30' }"
                class="timePicker"
              />-
              <el-time-select
                v-model="formBase.afternoonEndTime"
                :picker-options="{ start: '08:30', step: '00:15', end: '18:30' }"
                class="timePicker"
              />
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleAttendance">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="请假设置" name="second">
          <el-form
            ref="leaveForm"
            :rules="rules"
            :model="leaveBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="leaveBase.departmentId"
                placeholder="请选择"
                @change="handleChangeLeave"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <p>假期类型</p>
          <el-table :data="stateData.type" style="width: 100%">
            <el-table-column prop="name" label="类型" width="200" />
            <el-table-column label="是否可用">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isEnable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleLeave">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
          <el-alert type="warning" show-icon :closable="false">
            <template #default>
              <div class="tipInfo">
                <p>事假 请假单位为0.5天 只能提交工作日内的请假单</p>
                <p>当请假开关关闭后，员工则不可在员工端提交请假申请</p>
              </div>
            </template>
          </el-alert>
        </el-tab-pane>

        <el-tab-pane label="扣款设置" name="third">
          <el-form
            ref="deductionsForm"
            :rules="rules"
            :model="deductionsBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="deductionsBase.departmentId"
                placeholder="请选择"
                @change="handleChangeDeductions"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="stateData.departmentType" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <div>
                  {{ scope.row.name }}
                  <el-switch
                    v-model="scope.row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="() => handleStatus($event,scope.row)"
                  />
                </div>
                <div v-if="scope.row.dedTypeCode==='51000'" class="attentInfo">
                  <p>
                    迟到≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到≤
                      <el-input v-model="scope.row.timesUpperLimit" class="inputInfo"/>次，每次扣款
                      <el-input v-model="scope.row.dedAmonutUpperLimit" class="inputInfo"/>元
                    </p>
                    <p>
                      迟到>
                      <el-input v-model="scope.row.timesLowerLimit" class="inputInfo" disabled/>次，每次扣款
                      <el-input v-model="scope.row.dedAmonutLowerLimit" class="inputInfo"/>元
                    </p>
                  </div>
                  <p>
                    迟到>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled/>分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到>
                      <el-input v-model="scope.row.absenceTimesUpperLimt" class="inputInfo" disabled/>次，每次矿工
                      <el-input v-model="scope.row.absenceDays" class="inputInfo"/>天
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode==='52000'" class="attentInfo">
                  <p>
                    早退≤
                    <el-input v-model="scope.row.periodUpperLimit" class="inputInfo" value="30"/>分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      早退≤
                      <el-input v-model="scope.row.timesUpperLimit" class="inputInfo"/>次，每次扣款
                      <el-input v-model="scope.row.dedAmonutUpperLimit" class="inputInfo"/>元
                    </p>
                    <p>
                      早退>
                      <el-input v-model="scope.row.timesLowerLimit" class="inputInfo" disabled/>次，每次扣款
                      <el-input v-model="scope.row.dedAmonutLowerLimit" class="inputInfo"/>元
                    </p>
                  </div>
                  <p>
                    早退>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled/>分钟
                  </p>
                  <div style="padding-left:120px;">
                    <p>
                      早退>
                      <el-input v-model="scope.row.absenceTimesUpperLimt" class="inputInfo" disabled/>次，每次矿工
                      <el-input v-model="scope.row.absenceDays" class="inputInfo"/>天
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode==='53000'" class="attentInfo">
                  <p>
                    矿工按
                    <el-input v-model="scope.row.fineSalaryMultiples" class="inputInfo"/>倍工资处罚
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleDeductions">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="加班设置" name="fourth">
          <el-form
            ref="overtimeForm"
            :model="overtimeBase"
            :rules="overtimeRule"
            label-width="110px"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="overtimeBase.departmentId"
                placeholder="请选择"
                @change="handleChangeovertime"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="加班规则：">
              <div v-for="item in overtimeBase.rules" :key="item.id" class="ruleInfo">
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-switch v-model="item.isEnable" />
                      &nbsp;&nbsp;{{ item.rule }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div class="grid-content bg-purple-light">
                      <span class="pad">
                        <el-checkbox v-model="item.isTimeOff">调休假</el-checkbox>
                      </span>
                      <el-time-select
                        v-model="item.ruleStartTime"
                        :picker-options="{ start: '01:00', step: '00:15', end: '23:59' }"
                        style="width:100px;"
                        :disabled="!item.isTimeOff"
                      />
                      <el-time-select
                        v-model="item.ruleEndTime"
                        :picker-options="{ start: '01:00', step: '00:15', end: '23:59' }"
                        style="width:100px;"
                        :disabled="!item.isTimeOff"
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="打卡验证：" prop="isClock">
              <el-switch v-model="overtimeBase.isClock" />&nbsp;&nbsp;加班需要有打卡记录
            </el-form-item>
            <el-form-item label="开启补偿：" prop="isCompensationint">
              <el-switch v-model="overtimeBase.isCompensationint" />
            </el-form-item>
            <el-form-item label="调休假设置：" prop="latestEffectDate">
              <div class="ruleInfo">
                最晚有效期： 次年
                <el-date-picker
                  v-model="overtimeBase.latestEffectDate"
                  type="date"
                  placeholder="选择日期"
                  style="width:150px;"
                />
              </div>
            </el-form-item>
            <el-form-item label prop="unit">
              <div class="ruleInfo">
                <p>
                  请假最小单位
                  <el-input v-model="overtimeBase.unit" style="width:50px" />天
                </p>
              </div>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleOvertime">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { addEmployee } from '@/api/employee'
import { getDepartment } from '@/api/department'
import {
  attendanceSave, getAttendance, leaveSave, getLeave,
  deductionsSave, getDeductions, overtimeSave, getOvertime
} from '@/api/attendance'
import * as commonApi from '@/utils'

const emit = defineEmits(['handleCloseModal', 'dataSearch'])

const dialogFormVisible = ref(false)
const isShowSelect = ref(false)
const formOfEmployment = ref('')
const activeName = ref('first')

const formBase = reactive({
  morningStartTime: '',
  morningEndTime: '',
  afternoonStartTime: '',
  afternoonEndTime: '',
  departmentId: ''
})

const leaveBase = reactive({ departmentId: '' })
const deductionsBase = reactive({ departmentId: '' })

const overtimeBase = reactive({
  departmentId: '',
  isClock: false,
  isCompensationint: false,
  latestEffectDate: '',
  unit: '',
  rules: []
})

const departmentData = ref([])
const stateData = ref([])
const tylelist = ref([])
const deductionList = ref([])
const oldNum = ref('')

const rules = {
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  morningStartTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
}

const overtimeRule = {
  unit: [{ required: true, message: '调休单位不能为空', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  isClock: [{ required: true, message: '请选择打卡验证', trigger: 'change' }],
  isCompensationint: [{ required: true, message: '请选择补偿', trigger: 'change' }],
  latestEffectDate: [{ required: true, message: '请选择时间', trigger: 'change' }]
}

const dataForm = ref(null)
const leaveForm = ref(null)
const deductionsForm = ref(null)
const overtimeForm = ref(null)

const getDepartmentList = async () => {
  departmentData.value = await getDepartment()
  const firstId = departmentData.value[0]?.id || ''
  formBase.departmentId = firstId
  leaveBase.departmentId = firstId
  deductionsBase.departmentId = firstId
  overtimeBase.departmentId = firstId
  handleChange(firstId)
}

const dialogFormV = () => { dialogFormVisible.value = true }
const dialogFormH = () => { dialogFormVisible.value = false }

const clearFormDate = () => { Object.assign(formBase, {}) }

const handleClose = () => {
  dialogFormH()
  clearFormDate()
}

const createData = async () => {
  const valid = await dataForm.value.validate()
  if (valid) {
    await addEmployee(formBase)
    emit('clearFormDate', formBase)
    Object.assign(formBase, {})
    emit('doQuery', {})
    dialogFormVisible.value = false
  }
}

const handleChange = async (val) => {
  Object.assign(formBase, await getAttendance({ departmentId: val }))
}

const handleChangeLeave = async (val) => {
  leaveBase.departmentId = val
  stateData.value.type.forEach(item => {
    item.isEnable = false
    item.departmentId = val
  })
  const res = await getLeave({ departmentId: val })
  res.forEach(item => {
    item.isEnable = item.isEnable === 0
    stateData.value.type.forEach(v => {
      if (v.leaveType === item.leaveType) v.isEnable = item.isEnable
    })
  })
}

const handleChangeDeductions = async (val) => {
  deductionsBase.departmentId = val
  stateData.value.departmentType.forEach(item => {
    item.departmentId = val
    item.isEnable = false
  })
  const res = await getDeductions({ departmentId: val })
  res?.forEach(item => {
    item.isEnable = item.isEnable === 0
    stateData.value.departmentType.forEach(v => {
      if (v.dedTypeCode === item.dedTypeCode) v.isEnable = item.isEnable
    })
  })
}

const handleChangeovertime = async (val) => {
  overtimeBase.departmentId = val
  overtimeBase.rules.forEach(item => {
    item.departmentId = val
    item.isEnable = false
    item.isTimeOff = false
    item.ruleStartTime = ''
    item.ruleEndTime = ''
  })
  Object.assign(overtimeBase, {
    latestEffectDate: '', unit: '', isClock: false, isCompensationint: false
  })
  const data = await getOvertime({ departmentId: val })
  if (data.dayOffConfigs) {
    Object.assign(overtimeBase, data.dayOffConfigs)
    overtimeBase.isClock = data.extraDutyConfig?.isClock === 0
    overtimeBase.isCompensationint = data.extraDutyConfig?.isCompensationint === 0
  }
  if (data.extraDutyRuleList) {
    data.extraDutyRuleList.forEach(item => {
      item.isEnable = item.isEnable === 0
      item.isTimeOff = item.isTimeOff === 0
    })
    overtimeBase.rules = data.extraDutyRuleList
  }
}

const handleAttendance = async () => {
  const valid = await dataForm.value.validate()
  if (valid) {
    await attendanceSave(formBase)
    emit('dataSearch')
    handleClose()
  }
}

const handleLeave = async () => {
  const valid = await leaveForm.value.validate()
  if (valid) {
    const list = [...stateData.value.type]
    list.forEach(item => item.isEnable = item.isEnable ? '0' : '1')
    await leaveSave(list)
    emit('dataSearch')
    handleClose()
  }
}

const handleDeductions = async () => {
  const valid = await deductionsForm.value.validate()
  if (valid) {
    const list = [...stateData.value.departmentType]
    list.forEach(item => item.isEnable = item.isEnable ? '0' : '1')
    await deductionsSave(list)
    emit('dataSearch')
    handleClose()
  }
}

const handleOvertime = async () => {
  const valid = await overtimeForm.value.validate()
  if (valid) {
    const data = { ...overtimeBase }
    data.latestEffectDate = commonApi.transListToTreeData(data.latestEffectDate)
    data.isClock = data.isClock ? '0' : '1'
    data.isCompensationint = data.isCompensationint ? '0' : '1'
    data.rules.forEach(item => {
      item.isEnable = item.isEnable ? '0' : '1'
      item.isTimeOff = item.isTimeOff ? '0' : '1'
    })
    await overtimeSave(data)
    emit('dataSearch')
    handleClose()
  }
}

const handleClick = (tab) => {
  const idx = tab.index
  if (idx === '0') handleChange(formBase.departmentId)
  if (idx === '1') handleChangeLeave(leaveBase.departmentId)
  if (idx === '2') handleChangeDeductions(deductionsBase.departmentId)
  if (idx === '3') handleChangeovertime(overtimeBase.departmentId)
}

const typeTip = (obj) => ElMessage.error(obj)
const handleInput = () => {}
const handleInputPoint = () => {}

const handleStatus = (e, obj) => {
  obj.departmentId = deductionsBase.departmentId
  if (!obj.departmentId) {
    ElMessage.error('请选择部门')
    return false
  }
}

onMounted(() => {
  getDepartmentList()
  stateData.value = {
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
    ]
  }
})

defineExpose({ dialogFormV, dialogFormH })
</script>

<style lang="scss">
.inputInfo{width: 50px;}
.attentInfo {
  p { padding: 3px 0; }
  .el-input--medium .el-input__inner { height: 24px; line-height: 24px; }
}
.titmInfo .el-date-editor--timerange.el-input__inner { width: 280px; }
.titmInfo .el-date-editor .el-range-separator { padding: 0 15px 0 0; }
.ruleInfo .el-input--medium .el-input__inner { height: 30px; line-height: 30px; }
</style>

<style lang="scss" scoped>
.tipInfo p { padding: 5px 0; }
.titInfo { border-bottom: 1px solid #dcdfe6; height: 30px; line-height: 30px; padding: 0 0 15px; }
.attentInfo { padding: 30px 15px 15px 80px; }
.ruleInfo .pad { padding-left: 80px; }
</style>