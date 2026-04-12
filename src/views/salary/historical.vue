<template>
  <div class="historicalArcBox">
    <div class="historicalArcTop">
      <div class="title">
        <span>全公司</span>
        <div class="yearChange">
          <el-date-picker v-model="yearVal" type="year" size="small" placeholder="选择年" />
        </div>
      </div>
    </div>
    <div class="historicalTable">
      <div v-for="(itemes, index) in tableData" :key="index" class="itemes">
        <div class="itemTopLab" :class="{ act: itemes.act }">
          <div class="lab" @click="openTable(itemes, index)"> > </div>
          <div>
            <p class="title">{{ itemes.month }}社保报表 <span>{{ itemes.creationTime }}</span></p>
            <p class="labTit" @click="openTable(itemes, index)">社保报表</p>
          </div>
          <div>
            <p class="itemTit"><span>企业缴纳</span></p>
            <p class="itemNum">{{ itemes.enterprisePayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span>个人缴纳</span></p>
            <p class="itemNum">{{ itemes.personalPayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span>合计</span></p>
            <p class="itemNum">{{ itemes.total }}</p>
          </div>
        </div>
        <div v-show="itemes.act" class="itemDropDown">
          <div class="topLab">
            <div><span style="background-color:#cfeffe;" />已离职</div>
            <div><span style="background-color:#a8f8bb;" />再入职</div>
            <div><span style="background-color:#fedbd7;" />公司合计</div>
            <div><span style="background-color:#ffe8c9;" />一级部门</div>
            <div><span style="background-color:#fdfcd5;" />二级部门</div>
            <div class="rightLabBox">
              <a href="#"><el-icon><Search /></el-icon></a>
              <a href="#"><div>导出</div></a>
            </div>
          </div>
          <el-table :data="itemes.contentData" height="300" border style="width:100%;text-align:center">
            <el-table-column type="index" label="序号" fixed width="50" />
            <el-table-column prop="fullName" label="姓名" width="150px" />
            <el-table-column prop="dateOfEntry" label="入职时间" width="150px" />
            <el-table-column prop="cellPhoneNumber" label="手机号" width="150px" />
            <el-table-column prop="iDNumber" label="身份证号码" width="150px" />
            <el-table-column prop="bankCardNumber" label="银行卡号" width="150px" />
            <el-table-column prop="firstLevelDepartment" label="一级部门" width="150px" />
            <el-table-column prop="twoLevelDepartment" label="二级部门" width="150px" />
            <el-table-column prop="workCity" label="工作城市" width="150px" />
            <el-table-column prop="socialSecurityComputerNumber" label="社保电脑号" width="150px" />
            <el-table-column prop="providentFundAccount" label="公积金账号" width="150px" />
            <el-table-column prop="departureDate" label="离职日期" width="150px" />
            <el-table-column prop="householdType" label="户籍类型" width="150px" />
            <el-table-column prop="insuredCity" label="参保城市" width="150px" />
            <el-table-column prop="socialSecurityMonth" label="社保月份" width="150px" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArchivingList, getArchivingCont } from '@/api/social'
import { Search } from '@element-plus/icons-vue'

const yearVal = ref('2018')
const tableData = ref([])
const loading = ref(false)

const fetchArchivingList = async () => {
  loading.value = true
  const { data } = await getArchivingList({})
  tableData.value = data.items
  loading.value = false
}

const openTable = async (obj, index) => {
  if (!obj.act) {
    loading.value = true
    const { data } = await getArchivingCont({ month: obj.month })
    tableData.value[index].contentData = data.items
    tableData.value[index].act = true
    loading.value = false
  } else {
    tableData.value[index].act = false
  }
}

onMounted(fetchArchivingList)
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './../../styles/variables.scss';

.historicalArcBox{
  padding: 20px;
  .historicalArcTop{
    position:relative;
    background: #fff;
    padding:10px 15px 0 15px;
    .title{
      color:$panGreen;
      line-height: 40px;
      border-bottom: solid 2px $panGreen;
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      padding: 0 25px;
      .yearChange{
        position: absolute;
        top:5px;
        right: 10px;
      }
    }
  }
  .historicalTable{
    background: #fff;
    .itemes{
      .itemTopLab{
        border-top:solid 1px #f0f0f0;
        border-bottom: solid 3px #ccc;
        padding: 15px;
        div{
          display: inline-block;
          padding:0 50px;
          border-right: solid 1px #ccc;
        }
        div:last-child, div:first-child{
          border: none;
        }
        .lab{
          position: relative;
          top:-15px;
          padding-right: 0;
          padding-left: 15px;
        }
        .labTit{
          cursor:pointer;
        }
        .title{
          font-size: 16px;
          margin: 10px 0;
          span{
            position: relative;
            bottom:-2px;
            font-size: 13px;
            color:#999;
            margin-left: 5px;
          }
        }
        .itemTit{
          color:#999;
          margin: 8px 0;
          font-size: 13px;
        }
        .itemNum{
          font-size: 20px;
          margin: 0;
        }
      }
      .itemDropDown{
        background: #fff;
        .topLab{
          position: relative;
          padding: 15px;
          div{
            display: inline-block;
            margin: 0 10px;
            span{
              display: inline-block;
              position: relative;
              top:2px;
              margin-right: 5px;
              width: 15px;
              height: 15px;
              // background:$cl-1;
            }
          }
          .rightLabBox{
            position: absolute;
            right: -10px;
            top:10px;
            div{
              border:solid 1px $green;
              color:$green;
              border-radius:3px;
              padding: 4px 10px;
              font-size: 14px;
            }
          }
        }
      }
      .act{
        border-bottom:solid 3px $panGreen;
        .lab{
          color:$panGreen;
        }
        .labTit{
          color:$panGreen;
        }
      }
    }
    .itemes:hover{
      background: #fafbff;
    }
    .itemes .lab:hover{
      cursor:pointer;
    }
  }
}
</style>
