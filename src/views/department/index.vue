<template>
  <div class="container">
    <div class="app-container">
      <el-tree
        :expand-on-click-node="false"
        default-expand-all
        :data="datas"
        :props="defaultProps"
        style="width: 100%"
      >
        <template #default="{ data }">
          <el-row
            :gutter="20"
            style="width: 100%; height: 40px; line-height: 40px"
            align="middle"
            type="flex"
          >
            <!-- 左列：部门名称 -->
            <el-col :span="8">
              <span>{{ data.name }}</span>
            </el-col>
            <!-- 中列：部门负责人 -->
            <el-col :span="8">
              <span>{{ data.managerName || '-' }}</span>
            </el-col>
            <!-- 右列：操作下拉 -->
            <el-col :span="8" style="text-align: center; display: flex; align-items: center; justify-content: center; height: 100%">
              <el-dropdown @command="(val) => operateDept(val, data.id)">
                <span class="el-dropdown-link">
                  操作
                  <el-icon>
                    <ArrowDown />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                    <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                    <el-dropdown-item command="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <AddDept
      ref="addDeptRef"
      :current-node-id="currentNodeId"
      v-model:show-dialog="showDialog"
      @updateDepartment="getDepartmentList"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { transListToTreeData } from '@/utils'
import { getDepartment, delDepartment } from '../../api/department'
import AddDept from './components/AddDept.vue'

const currentNodeId = ref(null)
const showDialog = ref(false)
const datas = ref([])
const addDeptRef = ref(null)

const defaultProps = {
  children: 'children',
  label: 'name'
}

// 获取部门列表
const getDepartmentList = async () => {
  const res = await getDepartment()
  datas.value = transListToTreeData(res, 0)
}

// 部门操作
const operateDept = async (type, id) => {
  if (type === 'add') {
    showDialog.value = true
    currentNodeId.value = id
  } else if (type === 'edit') {
    showDialog.value = true
    currentNodeId.value = id
    nextTick(() => {
      addDeptRef.value?.getDetail()
    })
  } else {
      await ElMessageBox.confirm('确认删除该部门？', '提示', { type: 'warning' })
      await delDepartment(id)
      ElMessage.success('删除成功')
      getDepartmentList()
  }
}

onMounted(() => {
  getDepartmentList()
})
</script>

<style scoped>
.app-container {
  padding: 20px 40px;
  font-size: 14px;
}
</style>