<template>
  <div class="changeSalary">
    <div class="infoBox">
      <div class="logo"><img src="@/assets/common/img.jpeg" alt=""></div>
      <div class="info">
        <p><span class="name">{{ user.username }}</span></p>
        <p><span>部门：</span>{{ user.departmentName }}</p>
        <p><span>入职时间：</span>{{ formatDate(user.timeOfEntry) }}</p>
      </div>
    </div>
    <div>
      <el-form :model="ruleForm" label-width="110px">
        <el-form-item label="调整基本工资">
          <el-input :model-value="userSalary.currentBasicSalary" style="width:220px" disabled />
          <span class="Label">-></span>
          <el-input v-model="ruleForm.currentBasicSalary" style="width:220px" placeholder="请输入调整后基本工资" type="number" />
        </el-form-item>
        <el-form-item label="调整岗位工资">
          <el-input :model-value="userSalary.currentPostWage" style="width:220px" disabled />
          <span class="Label">-></span>
          <el-input v-model="ruleForm.currentPostWage" style="width:220px" placeholder="请输入调整后岗位工资" type="number" />
        </el-form-item>
        <el-form-item label="工资合计">
          <el-input v-model="computeCurrentTotal" style="width:220px" disabled />
          <span class="Label">-></span>
          <el-input v-model="computeChangeTotal" style="width:220px" disabled />
        </el-form-item>
        <el-form-item label="调整幅度">
          <el-input v-model="computeChangeSize" style="width:220px" disabled />
        </el-form-item>
        <div style="text-align:center;margin-top:40px">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onClose">关闭</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getUserDetailById } from '@/api/user'
import { changeSalary } from '@/api/salary'
import { ElMessage } from 'element-plus'

const props = defineProps({
  userSalary: { type: Object, default: () => ({}) },
  userId: { type: String, required: true }
})

const emit = defineEmits(['onDialogCancel', 'success'])

const user = ref({})
const ruleForm = reactive({})

const computeCurrentTotal = computed(() => {
  const base = Number(props.userSalary.currentBasicSalary) || 0
  const post = Number(props.userSalary.currentPostWage) || 0
  return base + post
})

const computeChangeTotal = computed(() => {
  const base = Number(ruleForm.currentBasicSalary) || 0
  const post = Number(ruleForm.currentPostWage) || 0
  return base + post
})

const computeChangeSize = computed(() => computeChangeTotal.value - computeCurrentTotal.value)

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''

const fetchUser = async () => {
  user.value = await getUserDetailById(props.userId)
}

const onSubmit = async () => {
  const sendData = { ...ruleForm, userId: props.userId }
  await changeSalary(sendData)
  ElMessage.success('保存成功')
  emit('success')
  onClose()
}

const onClose = () => {
  Object.keys(ruleForm).forEach(key => delete ruleForm[key])
  emit('onDialogCancel')
}

onMounted(fetchUser)
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../../styles/variables.scss';
  .changeSalary{
    .infoBox{
      display: flex;
      border-bottom: solid 1px #ccc;
      margin-bottom: 20px;
      padding: 10px 0 20px 0;
      img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .logo{
        border:solid 1px #ccc;
        width: 102px;
        height: 102px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .info{
        p{
          line-height: 30px;
          .name{font-size: 16px;}
          span{
            font-weight: bold;
            display: inline-block;
            margin-right: 0px;
            margin-left: 10px;
          }
        }
      }
      .buttones{
        text-align: center;
      }
    }
    .Label{
      margin: 0 20px;
      color:#999;
    }
  }
</style>
