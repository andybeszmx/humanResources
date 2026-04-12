<template>
  <div class="monthStatementBox">
    <div class="monthStatementTop">
      <div class="title">
        <span>工资报表</span>
      </div>
    </div>
    <div v-loading="loading" class="monthStatementTable">
      <div class="itemDropDown">
        <div class="topLab">
          <div />
          <div class="rightLabBox">
            <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          </div>
        </div>
        <el-table id="item" :data="contentData" border style="width:100%;text-align:center">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column prop="username" label="姓名" width="150px" />
          <el-table-column prop="mobile" label="手机号" width="150px" />
          <el-table-column prop="workNumber" label="工号" width="150px" />
          <el-table-column prop="departmentName" label="部门名称" width="150px" />
          <el-table-column prop="inServiceStatus" :formatter="inService" label="在职状态" width="150px" />
          <el-table-column prop="providentFundIndividual" label="公积金个人" width="150px" />
          <el-table-column prop="socialSecurityIndividual" label="社保个人" width="150px" />
          <el-table-column prop="socialSecurityEnterprise" label="社保企业" width="150px" />
          <el-table-column prop="providentFundEnterprises" label="公积金企业" width="150px" />
          <el-table-column prop="socialSecurityProvidentFundEnterprises" label="公积金社保企业" width="150px" />
          <el-table-column prop="currentBaseSalary" label="基本工资" width="150px" />
          <el-table-column prop="currentPostWage" label="岗位工资" width="150px" />
          <el-table-column prop="salaryChangeAmount" label="福利津贴" width="150px" />
          <el-table-column prop="attendanceDeductionMonthly" label="考勤扣款" width="150px" />
          <el-table-column prop="currentSalaryTotalBase" label="税前工资合计" width="150px" />
          <el-table-column prop="salaryByTax" label="应纳税工资" width="150px" />
          <el-table-column prop="tax" label="应扣税" width="150px" />
          <el-table-column prop="payment" label="实发工资" width="150px" />
        </el-table>
      </div>
    </div>
    <el-row type="flex" justify="center" align="middle" style="height:60px">
      <el-button type="primary" size="small" @click="archivingReportForm">归档{{ yearMonth ? yearMonth.substr(4) : '' }}报表</el-button>
      <el-button type="primary" size="small" @click="createReportForm">新建报表</el-button>
      <el-button size="small" @click="router.back()">取消</el-button>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArchivingCont, newReport } from '@/api/salary'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const yearMonth = ref(route.query.yearMonth)
const loading = ref(false)
const contentData = ref([])

const inService = (row) => row.inServiceStatus === '1' ? '在职' : '离职'

const fetchArchivingCont = async () => {
  loading.value = true
  contentData.value = await getArchivingCont({ yearMonth: yearMonth.value, opType: 1 })
  loading.value = false
}

const archivingReportForm = () => {
  ElMessageBox.confirm('您确认归档当月报表吗？').then(async () => {
    // await getArchivingArchive({ yearMonth: yearMonth.value })
    ElMessage.success('归档成功')
  })
}

const getNextMonth = () => {
  const year = yearMonth.value.substring(0, 4)
  const month = yearMonth.value.slice(4)
  let year2 = year
  let month2 = parseInt(month) + 1
  if (month2 === 13) {
    year2 = parseInt(year2) + 1
    month2 = 1
  }
  if (month2 < 10) month2 = '0' + month2
  return year2 + month2
}

const createReportForm = () => {
  const next = getNextMonth()
  const year = next.substring(0, 4)
  const month = next.substring(4)
  ElMessageBox.confirm(`您将创建 《 ${year}年${month}月 》 报表`).then(async () => {
    yearMonth.value = next
    await newReport({ yearMonth: next })
    ElMessage.success('新建报表成功')
    fetchArchivingCont()
  })
}

const handleExport = () => {
  // 导出逻辑
}

onMounted(fetchArchivingCont)
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../../styles/variables.scss";
.monthStatementBox {
  padding: 20px;
  .monthStatementTop {
    position: relative;
    background: #fff;
    padding: 10px 15px 0 15px;
    border-bottom: solid 1px #f4f4f4;
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
  .monthStatementTable {
    background: #fff;
    .itemTopLab {
      border-top: solid 1px #f0f0f0;
      border-bottom: solid 3px #ccc;
      padding: 15px;
      div {
        display: inline-block;
        padding: 0 50px;
        border-right: solid 1px #ccc;
      }
      div:last-child,
      div:first-child {
        border: none;
      }
      .lab {
        position: relative;
        top: -15px;
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
        padding: 15px;
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
          div {
            border: solid 1px $green;
            color: $green;
            border-radius: 3px;
            padding: 4px 10px;
            font-size: 14px;
          }
        }
      }
      .act {
        border-bottom: solid 3px $panGreen;
        .lab {
          color: $panGreen;
        }
        .labTit {
          color: $panGreen;
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
  .butList {
    border-top: solid 1px #f4f4f4;
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
}
</style>
