<template>
  <div class="fixedDalary">
    <el-form label-position="left" label-width="120px" :model="formLabelAlign">
      <el-form-item label="当前基本工资">
        <el-input v-model="formLabelAlign.currentBasicSalary" placeholder="当前基本工资" style="width:60%" type="number" />
      </el-form-item>
      <el-form-item label="当前岗位工资">
        <el-input v-model="formLabelAlign.currentPostWage" placeholder="当前岗位工资" style="width:60%" type="number" />
      </el-form-item>
      <el-form-item label="当前工资合计">
        <el-input v-model="computeCurrentTotal" placeholder="当前工资合计, 自动计算" style="width:60%" disabled />
      </el-form-item>
      <el-form-item label="转正基本工资">
        <el-input v-model="formLabelAlign.correctionOfBasicWages" placeholder="转正基本工资" style="width:60%" type="number" />
      </el-form-item>
      <el-form-item label="转正岗位工资">
        <el-input v-model="formLabelAlign.turnToPostWages" placeholder="转正岗位工资" style="width:60%" type="number" />
      </el-form-item>
      <el-form-item label="转正工资合计">
        <el-input v-model="computeTurnTotal" placeholder="转正工资合计, 自动计算" style="width:60%" disabled />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="onClose">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { initSalary } from '@/api/salary'
import { ElMessage } from 'element-plus'

const props = defineProps({
  userId: { type: String, required: true }
})

const emit = defineEmits(['onDialogCancel', 'success'])

const formLabelAlign = reactive({})

const computeCurrentTotal = computed(() => {
  const base = Number(formLabelAlign.currentBasicSalary) || 0
  const post = Number(formLabelAlign.currentPostWage) || 0
  return base + post
})

const computeTurnTotal = computed(() => {
  const base = Number(formLabelAlign.correctionOfBasicWages) || 0
  const post = Number(formLabelAlign.turnToPostWages) || 0
  return base + post
})

const onSubmit = async () => {
  const sendData = { ...formLabelAlign, userId: props.userId }
  await initSalary(sendData)
  ElMessage.success('定薪成功')
  emit('success')
  onClose()
}

const onClose = () => {
  Object.keys(formLabelAlign).forEach(key => delete formLabelAlign[key])
  emit('onDialogCancel')
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/variables";
.fixedDalary {
  .infoBox {
    display: flex;
    border-bottom: solid 1px #ccc;
    margin-bottom: 20px;
    padding: 10px 0 20px 0;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .logo {
      border: solid 1px #ccc;
      width: 102px;
      height: 102px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .info {
      p {
        line-height: 30px;
        .name {
          font-size: 16px;
        }
        span {
          font-weight: bold;
          display: inline-block;
          margin-right: 0px;
          margin-left: 10px;
        }
      }
    }
    .buttones {
      text-align: center;
    }
  }
  .Label {
    margin: 0 20px;
    color: #999;
  }
}
</style>
