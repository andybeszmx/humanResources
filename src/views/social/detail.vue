<template>
  <div class="detailBox">
    <div class="detailTop">
      <div>
        <img src="@/assets/common/img.jpeg" width="100" height="100" alt="">
      </div>
      <div>
        <b>{{ sizeForm.user.username }}</b>
        <span :class="dutyStatus ? 'job-txt-green' : 'job-txt-red'">{{ dutyStatusTxt }}</span>
        <br>
        <p>
          <span>最新工资基数 {{ sizeForm.salaryBase }} </span>
          &emsp;&emsp;
          <span>入职时间 {{ formatDate(sizeForm.user.timeOfEntry) }}</span>
          &emsp;&emsp;
          <span>联系电话 {{ sizeForm.user.mobile }}</span>
        </p>
        <br>
        <p>
          本月不缴纳社保
          <el-switch v-model="isPaySocialInMonth" active-color="#13ce66" inactive-color="#ff4949" />&emsp;&emsp;
          本月不缴纳公积金
          <el-switch v-model="isPayProvidentInMonth" active-color="#13ce66" inactive-color="#ff4949" />
        </p>
      </div>
    </div>
    <div class="detailContentBox">
      <el-form ref="sizeFormRef" :model="sizeForm.userSocialSecurity" :rules="rules" label-width="100px" size="small">
        <el-form-item label="参保城市" prop="participatingInTheCity">
          <el-select
            v-model="sizeForm.userSocialSecurity.participatingInTheCity"
            value-key="id"
            placeholder="请选择参保城市"
            @change="socialSecurityCityChange"
          >
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="社保类型" prop="socialSecurityType">
          <el-select v-model="sizeForm.userSocialSecurity.socialSecurityType" placeholder="请选择社保类型">
            <el-option label="首次开户" :value="1" />
            <el-option label="非首次开户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="户籍类型" prop="householdRegistrationType">
          <el-select v-model="sizeForm.userSocialSecurity.householdRegistrationType" placeholder="请选择户籍类型">
            <el-option label="本市城镇" :value="1" />
            <el-option label="本市农村" :value="2" />
            <el-option label="外阜城镇" :value="3" />
            <el-option label="外阜农村" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="社保基数" prop="socialSecurityBase">
          <el-input v-model="sizeForm.userSocialSecurity.socialSecurityBase" type="number" style="width:38%" />
          <span>（基数范围是3387 ~ 25401）</span>
        </el-form-item>
        <el-form-item label="工伤比例" prop="industrialInjuryRatio">
          <el-input v-model="sizeForm.userSocialSecurity.industrialInjuryRatio" style="width:38%" type="number" />
          <span>（比例范围是0.2％ ~ 3％，推荐0.2％）</span>
        </el-form-item>
        <el-form-item label="社保缴纳">
          <el-form-item label="个人" label-width="74px" style="display:inline-block">
            <el-input v-model="personalPayment" style="width:100%" placeholder="个人" disabled />
          </el-form-item>
          <el-form-item label="公司" label-width="74px" style="display:inline-block">
            <el-input v-model="companyPayment" style="width:100%" placeholder="企业" disabled />
          </el-form-item>
          <el-table :data="computePaymentItemList" size="small">
            <el-table-column label="缴费项目" prop="name" />
            <el-table-column label="企业基数">
              <template #default="paymentItem">
                <span v-show="paymentItem.row.switchCompany">{{ sizeForm.userSocialSecurity.socialSecurityBase }}</span>
              </template>
            </el-table-column>
            <el-table-column label="企业比例">
              <template #default="paymentItem">
                <span v-show="paymentItem.row.switchCompany">{{ paymentItem.row.scaleCompany }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="企业缴纳">
              <template #default="paymentItem">
                <el-input v-show="paymentItem.row.switchCompany" v-model="paymentItem.row.companyPay" disabled />
              </template>
            </el-table-column>
            <el-table-column label="个人基数">
              <template #default="paymentItem">
                <span v-show="paymentItem.row.switchPersonal">{{ sizeForm.userSocialSecurity.socialSecurityBase }}</span>
              </template>
            </el-table-column>
            <el-table-column label="个人比例">
              <template #default="paymentItem">
                <span v-show="paymentItem.row.switchPersonal">{{ paymentItem.row.scalePersonal }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="个人缴纳">
              <template #default="paymentItem">
                <el-input v-show="paymentItem.row.switchPersonal" v-model="paymentItem.row.personalPay" disabled />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="社保备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.socialSecurityNotes"
            type="textarea"
            :rows="2"
            placeholder="1-300字符"
            maxlength="300"
            style="width:38%"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="公积金城市" prop="providentFundCity">
          <el-select v-model="sizeForm.userSocialSecurity.providentFundCity" placeholder="请选择公积金城市" value-key="id">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="公积金基数" prop="providentFundBase">
          <el-input v-model="sizeForm.userSocialSecurity.providentFundBase" style="width:38%" type="number" />
          <span>（基数范围是2273 ~ 25401）</span>
        </el-form-item>
        <el-form-item label="企业比例" prop="enterpriseProportion">
          <el-input v-model="sizeForm.userSocialSecurity.enterpriseProportion" style="width:38%" placeholder="12" type="number" />
          <span>（比例范围是5％ ~ 12％，推荐12％）</span>
        </el-form-item>
        <el-form-item label="个人比例" prop="personalProportion">
          <el-input v-model="sizeForm.userSocialSecurity.personalProportion" style="width:38%" placeholder="12" type="number" />
          <span>（比例范围是5％ ~ 12％，推荐12％）</span>
        </el-form-item>
        <el-form-item label="公积金缴纳">
          <el-form-item label="个人" label-width="50px" style="display:inline-block" prop="personalProvidentFundPayment">
            <el-input v-model="sizeForm.userSocialSecurity.personalProvidentFundPayment" style="width:100%" placeholder="个人" type="number" />
          </el-form-item>
          <el-form-item label="公司" label-width="50px" style="display:inline-block" prop="enterpriseProvidentFundPayment">
            <el-input v-model="sizeForm.userSocialSecurity.enterpriseProvidentFundPayment" style="width:100%" placeholder="企业" type="number" />
          </el-form-item>
          <el-form-item style="display:inline-block">
            <span>（为自动测算结果，可手动调整）</span>
          </el-form-item>
        </el-form-item>
        <el-form-item label="公积金备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.providentFundNotes"
            type="textarea"
            :rows="2"
            placeholder="1-300字符"
            style="width:38%"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { saveContent, getContent, getPaymentItemList } from '@/api/social'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const sizeFormRef = ref()
const sizeForm = reactive({
  user: {},
  userSocialSecurity: {
    socialSecurityBase: 3387,
    industrialInjuryRatio: 0.2
  },
  salaryBase: 0,
  userId: route.params.id
})

const cityList = ref([])
const paymentItemList = ref([])
const personalPayment = ref(0.0)
const companyPayment = ref(0.0)
const isPaySocialInMonth = ref(false)
const isPayProvidentInMonth = ref(false)

// 表单验证规则
const validateSocialSecurityBase = (rule, value, callback) => {
  if (!value) callback(new Error('请输入社保基数'))
  else if (value < 3387 || value > 25401) callback(new Error('请不要超出范围，基数范围是3387 ~ 25401'))
  else callback()
}
const validateIndustrialInjuryRatio = (rule, value, callback) => {
  if (!value) callback(new Error('请输入工伤比例'))
  else if (value < 0.2 || value > 3) callback(new Error('请不要超出范围，比例范围是0.2％ ~ 3％'))
  else callback()
}
const validateProvidentFundBase = (rule, value, callback) => {
  if (!value) callback(new Error('请输入公积金基数'))
  else if (value < 2273 || value > 25401) callback(new Error('请不要超出范围，基数范围是2273 ~ 25401'))
  else callback()
}
const validateEnterpriseProportion = (rule, value, callback) => {
  if (!value) callback(new Error('请输入企业比例'))
  else if (value < 5 || value > 12) callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
  else callback()
}
const validatePersonalProportion = (rule, value, callback) => {
  if (!value) callback(new Error('请输入个人比例'))
  else if (value < 5 || value > 12) callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
  else callback()
}

const rules = {
  participatingInTheCity: [{ required: true, message: '请选择参保城市', trigger: 'change' }],
  socialSecurityType: [{ required: true, message: '请选择社保类型', trigger: 'change' }],
  householdRegistrationType: [{ required: true, message: '请选择户籍类型', trigger: 'change' }],
  socialSecurityBase: [{ required: true, validator: validateSocialSecurityBase, trigger: 'blur' }],
  industrialInjuryRatio: [{ required: true, validator: validateIndustrialInjuryRatio, trigger: 'blur' }],
  providentFundCity: [{ required: true, message: '请选择公积金城市', trigger: 'change' }],
  providentFundBase: [{ required: true, validator: validateProvidentFundBase, trigger: 'blur' }],
  enterpriseProportion: [{ required: true, validator: validateEnterpriseProportion, trigger: 'blur' }],
  personalProportion: [{ required: true, validator: validatePersonalProportion, trigger: 'blur' }],
  enterpriseProvidentFundPayment: [{ required: true, message: '请输入公司公积金缴纳数额', trigger: 'change' }],
  personalProvidentFundPayment: [{ required: true, message: '请输入个人公积金缴纳数额', trigger: 'change' }]
}

const dutyStatusTxt = computed(() => sizeForm.user.inServiceStatus === 1 ? '在职' : '离职')
const dutyStatus = computed(() => sizeForm.user.inServiceStatus === 1)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

// 计算社保缴费项目列表（同时更新个人/企业合计）
const computePaymentItemList = computed(() => {
  let personalTotal = 0
  let companyTotal = 0
  paymentItemList.value.forEach(item => {
    if (item.name === '工伤' && item.switchCompany) {
      item.scaleCompany = sizeForm.userSocialSecurity.industrialInjuryRatio
    }
    if (item.switchCompany) {
      item.companyPay = parseFloat((sizeForm.userSocialSecurity.socialSecurityBase * item.scaleCompany) / 100).toFixed(2)
      companyTotal += Number(item.companyPay)
    }
    if (item.switchPersonal) {
      item.personalPay = parseFloat((sizeForm.userSocialSecurity.socialSecurityBase * item.scalePersonal) / 100).toFixed(2)
      personalTotal += Number(item.personalPay)
    }
  })
  personalPayment.value = parseFloat(personalTotal).toFixed(2)
  companyPayment.value = parseFloat(companyTotal).toFixed(2)
  return paymentItemList.value
})

// 公积金自动计算
const changeProvidentFundPayment = () => {
  const base = sizeForm.userSocialSecurity.providentFundBase
  const enterpriseRate = sizeForm.userSocialSecurity.enterpriseProportion
  const personalRate = sizeForm.userSocialSecurity.personalProportion
  if (base && enterpriseRate) {
    sizeForm.userSocialSecurity.enterpriseProvidentFundPayment = parseFloat((enterpriseRate * base) / 100).toFixed(2)
  }
  if (base && personalRate) {
    sizeForm.userSocialSecurity.personalProvidentFundPayment = parseFloat((personalRate * base) / 100).toFixed(2)
  }
}

watch(() => sizeForm.userSocialSecurity.providentFundBase, changeProvidentFundPayment)
watch(() => sizeForm.userSocialSecurity.enterpriseProportion, changeProvidentFundPayment)
watch(() => sizeForm.userSocialSecurity.personalProportion, changeProvidentFundPayment)

const socialSecurityCityChange = async (obj) => {
  sizeForm.userSocialSecurity.participatingInTheCity = obj
  paymentItemList.value = await getPaymentItemList(obj.id)
}

const onSubmit = async () => {
  try {
    await sizeFormRef.value.validate()
    sizeForm.userSocialSecurity.enterprisesPaySocialSecurityThisMonth = isPaySocialInMonth.value ? 1 : 0
    sizeForm.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth = isPayProvidentInMonth.value ? 1 : 0
    sizeForm.userSocialSecurity.userId = sizeForm.userId
    const city = sizeForm.userSocialSecurity.participatingInTheCity
    sizeForm.userSocialSecurity.participatingInTheCity = city.name
    sizeForm.userSocialSecurity.participatingInTheCityId = city.id
    sizeForm.userSocialSecurity.providentFundCity = city.name
    sizeForm.userSocialSecurity.providentFundCityId = city.id
    await saveContent(sizeForm.userSocialSecurity)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error(error)
  }
}

const fetchContent = async () => {
  const data = await getContent(route.params.id)
  if (data.userSocialSecurity) {
    Object.assign(sizeForm, data)
    sizeForm.userId = route.params.id
    const city = {
      name: data.userSocialSecurity.participatingInTheCity,
      id: data.userSocialSecurity.participatingInTheCityId
    }
    paymentItemList.value = await getPaymentItemList(city.id)
    sizeForm.userSocialSecurity.participatingInTheCity = city
  } else {
    sizeForm.user = data.user
  }
}

onMounted(fetchContent)
</script>

<style scoped lang="scss">
.detailBox {
  margin: 20px;
  .detailTop {
    background: #fff;
    padding: 15px;
    display: flex;
    img {
      border-radius: 50%;
      margin-right: 40px;
      box-shadow: 1px 2px 4px #cccccc;
    }
  }
  .detailContentBox {
    margin: 15px 0;
    padding: 15px;
    background: #fff;
  }
}
.job-txt-green, .job-txt-red {
  display: inline-block;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}
.job-txt-green { background: #67c23a; }
.job-txt-red { background: #f56c6c; }
</style>