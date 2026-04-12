<template>
  <div class="historicalArcBox">
    <div class="historicalArcTop">
      <div class="title">
        <span>员工历史归档</span>
        <div class="yearChange">
          <el-date-picker
            v-model="yearVal"
            type="year"
            format="yyyy"
            value-format="yyyy"
            width="130px"
            placeholder="选择年"
            @change="handleChangeYear"
          />
        </div>
      </div>
    </div>
    <div v-loading="loading" class="historicalTable">
      <div v-show="showArchivig" class="archivig">该年份无归档报表</div>
      <div v-for="( itemes, index) in tableData" :key="index" class="itemes">
        <div class="itemTopLab" :class="{act: itemes.act}">
          <div class="lab" @click="() => openTable(itemes,index)">
            >
          </div>
          <div>
            <p class="title">{{ itemes.archiveYear }}-{{ itemes.archiveMonth }}月员工报表</p>
            <p class="labTit" @click="() => openTable(itemes,index)">考勤统计</p>
          </div>
          <div class="fr">
            <div>
              <p class="itemTit">
                <span>总人数</span>
              </p>
              <p class="itemNum">{{ itemes.totalPeopleNum }}</p>
            </div>
            <div>
              <p class="itemTit">
                <span>全勤人数</span>
              </p>
              <p class="itemNum">{{ itemes.fullAttePeopleNum }}</p>
            </div>
          </div>
        </div>
        <div v-show="itemes.act" class="itemDropDown">
          <el-alert
            title="迟到、早退和补签的统计单位为“次”；所有假期类型、外出、旷工的统计单位均为“天”。"
            type="warning"
            :closable="false"
            show-icon
          />
          <div class="topLab">
            <div class="rightLabBox">
              <a
                class="el-button fr el-button--primary el-button--mini"
                title="导出"
                @click="() => handleExport(index)"
              >导出</a>
            </div>
          </div>
          <el-table
            :data="contentData"
            height="300"
            border
            style="width: 100%;text-align: center"
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
            <el-table-column prop="absenceDays" label="旷工天数" width="100" />
            <el-table-column prop="isFullAttendanceint" :formatter="fStandards" label="是否全勤" width="100" />
            <el-table-column prop="actualAtteOfficialDays" label="实际出勤天数（正式）" width="180" />
            <el-table-column prop="workingDays" label="应出勤工作日" width="120" />
            <el-table-column prop="salaryOfficialDays" label="计薪天数（正式）" width="150" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getDepartment } from '@/api/department'
import { getArchiving, getArchivingCont } from '@/api/attendance'

const num = ref(0)
const yearVal = ref('')
const tableData = ref([])
const showArchivig = ref(false)
const counts = ref('')
const requestParameters = reactive({
  departmentId: '',
  year: ''
})
const baseData = reactive({
  atteArchiveMonthlyId: ''
})
const loading = ref(false)
const showHeight = ref(40)
const boxHeight = ref('')
const departmentData = ref([])
const contentData = ref([])

const getMonth = () => {
  const nowdays = new Date()
  let year = nowdays.getFullYear()
  let month = nowdays.getMonth()
  if (month === 0) {
    month = 12
    year -= 1
  }
  if (month < 10) {
    month = '0' + month
  }
  return {
    preDates: year + '-' + month,
    preYear: year,
    preMonth: month
  }
}

const fStandards = (val) => val === 0 ? '是' : '否'

const getArchivingList = async (params) => {
  tableData.value = await getArchiving(params)
  showArchivig.value = tableData.value.length === 0
  loading.value = false
}

const getDepartmentList = async () => {
  departmentData.value = await getDepartment()
  requestParameters.departmentId = departmentData.value[0]?.id || ''
  getArchivingList(requestParameters)
}

const openTable = async (obj, index) => {
  baseData.atteArchiveMonthlyId = obj.id
  if (!obj.act) {
    contentData.value = await getArchivingCont(baseData)
    loading.value = false
    tableData.value[index].act = true
  } else {
    tableData.value[index].act = false
  }
}

const handleExport = (index) => {}

const handleChangeYear = () => {
  requestParameters.year = yearVal.value
  getArchivingList(requestParameters)
  showArchivig.value = tableData.value.length === 0
}

onMounted(() => {
  const { preDates, preYear } = getMonth()
  yearVal.value = preDates
  requestParameters.year = preYear
  getDepartmentList()
})
</script>

<style lang="scss" scoped>
@import "./../../styles/variables.scss";
.historicalArcBox {
  padding: 20px;
  .historicalArcTop {
    position: relative;
    background: #fff;
    padding: 10px 15px 0 15px;
    .title {
      color: $blue;
      line-height: 40px;
      border-bottom: solid 2px $blue;
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      padding: 0 25px;
      .yearChange {
        position: absolute;
        top: 5px;
        right: 10px;
      }
    }
  }
  .historicalTable {
    background: #fff;
    .itemes {
      .itemTopLab {
        border-top: solid 1px #f0f0f0;
        border-bottom: solid 3px #ccc;
        padding: 15px;
        .fr {
          text-align: center;
        }
        div {
          display: inline-block;
          padding: 10px 50px 0;
        }
        div:last-child,
        div:first-child {
          border: none;
        }
        .lab {
          position: relative;
          top: -30px;
          padding-right: 0;
          padding-left: 15px;
        }
        .labTit {
          cursor: pointer;
        }
        .title {
          font-size: 16px;
          margin: 10px 0;
          span {
            position: relative;
            bottom: -2px;
            font-size: 13px;
            color: #999;
            margin-left: 5px;
          }
        }
        .itemTit {
          color: #999;
          margin: 8px 0;
          font-size: 13px;
        }
        .itemNum {
          font-size: 20px;
          margin: 0;
        }
      }
      .itemDropDown {
        background: #fff;
        .topLab {
          position: relative;
          padding: 15px 15px 30px;
          div {
            display: inline-block;
            margin: 0 10px;
            span {
              display: inline-block;
              position: relative;
              top: 2px;
              margin-right: 5px;
              width: 15px;
              height: 15px;
              background: $cl-1;
            }
          }
          .rightLabBox {
            position: absolute;
            right: -10px;
            top: 10px;
            .btn {
              border: solid 1px $green;
              color: $green;
              border-radius: 3px;
              padding: 4px 10px;
              font-size: 14px;
            }
          }
        }
      }
      .act {
        border-bottom: solid 3px $blue;
        .lab {
          color: $blue;
        }
        .labTit {
          color: $blue;
        }
      }
    }
    .itemes:hover {
      background: #fafbff;
    }
    .itemes .lab:hover {
      cursor: pointer;
    }
  }
}
</style>