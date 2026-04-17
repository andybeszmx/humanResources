<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" size="small" class="btn-add" @click="dialogform()">添加权限</el-button>
      <el-table default-expand-all :data="list" row-key="id" border style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button v-if="row.type === 1" link size="small" @click="dialogform(row.id)">添加</el-button>
            <el-button link size="small" @click="editDialogForm(row.id)">编辑</el-button>
            <el-popconfirm
              title="确定删除该权限吗？"
              @confirm="confirmDel(row.id)"
            >
              <template #reference>
                <el-button size="small" link style="margin-left: 10px">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialogform
      v-model:edit-id="editId"
      v-model:current-id="currentId"
      v-model:dialog-visible="dialogVisible"
      @updatePermissionList="getPermission"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPermissionList, delPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
import Dialogform from './component/dialogform.vue'

const currentId = ref(null)
const editId = ref(null)
const dialogVisible = ref(false)
const list = ref([])

const getPermission = async () => {
  const res = await getPermissionList()
  list.value = transListToTreeData(res, 0)
}

// 打开添加弹窗
const dialogform = (id) => {
  if (id) {
    currentId.value = id
  }
  dialogVisible.value = true
}

// 打开编辑弹窗
const editDialogForm = (id) => {
  editId.value = id
  dialogVisible.value = true
}

// 删除权限
const confirmDel = async (id) => {
  await ElMessageBox.confirm('确定删除该权限吗？', '提示', { type: 'warning' })
  await delPermission(id)
  ElMessage.success('删除成功')
  getPermission()
}

onMounted(() => {
  getPermission()
})
</script>

<style scoped>
.btn-add {
  margin: 20px 10px;
}
</style>