<template>
  <el-card class="settingContent">
    <el-tabs v-model="activeName">
      <el-tab-pane label="计薪设置" name="first">
        <el-form label-position="left" label-width="140px" :model="sendForm">
          <el-form-item label="对应社保自然月">
            <el-select v-model="sendForm.socialSecurityType" style="width: 280px;">
              <el-option label="当月" :value="1" />
              <el-option label="次月" :value="2" />
            </el-select>
            <el-tooltip content="如果201606月工资中扣除2016年6月自然月的社保公积金，请选择当月；如果扣除2016年7月自然月的社保公积金，请选择次月。" placement="top">
              <el-icon><Bell /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="社保数据来源" style="width: 450px;">
            <el-input placeholder="社保模块" style="width: 280px;" disabled />
            <el-tooltip content="计算工资时的五险一金金额将取自社保报表" placement="top">
              <el-icon><Bell /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="考勤数据来源" style="width: 450px;">
            <el-input placeholder="考勤模块" style="width: 280px;" disabled />
            <el-tooltip content="计算工资时的考勤数据将取自考勤统计表" placement="top">
              <el-icon><Bell /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="津贴设置" name="second">
        <el-form ref="sendFormRef" :model="sendForm" label-width="100px">
          <el-form-item label="通用方案">
            <el-input v-model="sendForm.subsidyName" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="sendForm.subsidyRemark" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="津贴名称" class="nameList">
            <p v-for="field in subsidyFields" :key="field.name">
              <el-input :placeholder="field.placeholder" style="width:200px" disabled />
              <el-select v-model="sendForm[field.scheme]" placeholder="请选择">
                <el-option v-for="item in subsidySchemes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-tooltip :content="tooltipText" placement="top">
                <el-icon><Bell /></el-icon>
              </el-tooltip>
              <el-input v-model="sendForm[field.amount]" placeholder="请输入内容" style="width:200px" />
            </p>
          </el-form-item>
          <el-form-item label="适用计税方式">
            <el-radio-group v-model="sendForm.taxCalculationType">
              <el-radio label="1">税前</el-radio>
              <el-radio label="2">税后</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSettings, saveSettings } from '@/api/salary'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'

const activeName = ref('first')
const sendFormRef = ref()
const subsidySchemes = [
  { id: 1, name: '每出勤日' },
  { id: 3, name: '每月固定' }
]
const tooltipText = '每出勤日：金额*实际出勤天数；每计薪日：金额*计薪天数；每月固定：固定金额；每月（按出勤日）：金额*实际出勤天数/应出勤工作日；每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）'

const sendForm = reactive({
  socialSecurityType: 1,
  transportationSubsidyScheme: 1,
  communicationSubsidyScheme: 1,
  lunchAllowanceScheme: 1,
  housingSubsidyScheme: 1,
  taxCalculationType: '1',
  transportationSubsidyAmount: 2.1,
  communicationSubsidyAmount: 1.2,
  lunchAllowanceAmount: 1.3,
  housingSubsidyAmount: 1.5,
  subsidyName: '',
  subsidyRemark: ''
})

const subsidyFields = [
  { placeholder: '交通补贴', scheme: 'transportationSubsidyScheme', amount: 'transportationSubsidyAmount' },
  { placeholder: '通讯补贴', scheme: 'communicationSubsidyScheme', amount: 'communicationSubsidyAmount' },
  { placeholder: '午餐补贴', scheme: 'lunchAllowanceScheme', amount: 'lunchAllowanceAmount' },
  { placeholder: '住房补助', scheme: 'housingSubsidyScheme', amount: 'housingSubsidyAmount' }
]

const fetchSettings = async () => {
  const res = await getSettings()
  Object.assign(sendForm, res)
}

const submitForm = async () => {
  await saveSettings(sendForm)
  ElMessage.success('保存成功')
}

const resetForm = () => {
  sendFormRef.value?.resetFields()
  fetchSettings()
}

onMounted(fetchSettings)
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .settingContent{
    padding: 20px;

  }
</style>
