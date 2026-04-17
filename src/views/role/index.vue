<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPermissionList } from '@/api/permission'
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { transListToTreeData } from '@/utils'

const showDialog = ref(false)
const list = ref([])
const pageParams = reactive({
  page: 1,
  pagesize: 5,
  total: 0
})
const roleForm = reactive({
  name: '',
  description: '',
  state: 0 // 1=启用, 0=禁用
})
const rules = {
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
}
const showPermissionDialog = ref(false)
const permissionData = ref([])
const perIds = ref([])
const currentRoleId = ref(null)

const roleFormRef = ref(null)
const permTreeRef = ref(null)

// 获取角色列表
const getRole = async () => {
  const { rows, total } = await getRoleList(pageParams)
  // 为每行添加编辑状态和缓存数据
  list.value = rows.map(item => ({
    ...item,
    isEdit: false,
    editRow: {
      name: item.name,
      description: item.description,
      state: item.state
    }
  }))
  pageParams.total = total
}

// 分页切换
const changePage = (newPage) => {
  pageParams.page = newPage
  getRole()
}

// 新增角色确定
const btnOK = async () => {
  await roleFormRef.value.validate(async (valid) => {
    if (!valid) return
    await addRole(roleForm)
    ElMessage.success('新增角色成功')
    getRole()
    btnCancel()
  })
}

// 关闭弹窗+重置表单
const btnCancel = () => {
  roleFormRef.value?.resetFields()
  // 重置表单数据
  Object.assign(roleForm, {
    name: '',
    description: '',
    state: 0
  })
  showDialog.value = false
}

// 进入编辑状态
const btnEdit = (row) => {
  // 同步当前数据到编辑缓存
  row.editRow.name = row.name
  row.editRow.description = row.description
  row.editRow.state = row.state
  row.isEdit = true
}

// 编辑确定
const btnEditOK = async (row) => {
  if (!row.editRow.name || !row.editRow.description) {
    ElMessage.warning('角色和描述不能为空')
    return
  }
  await updateRole({ ...row.editRow, id: row.id })
  ElMessage.success('更新角色成功')
  // 更新原数据，退出编辑
  Object.assign(row, row.editRow)
  row.isEdit = false
}

// 删除角色
const confirmDel = async (id) => {
  await ElMessageBox.confirm('确定删除该角色吗？', '提示', { type: 'warning' })
  await delRole(id)
  ElMessage.success('删除角色成功')
  // 删除最后一页最后一条时，页码减1
  if (list.value.length === 1 && pageParams.page > 1) {
    pageParams.page--
  }
  getRole()
}

// 打开权限分配弹窗
const btnPermission = async (id) => {
  currentRoleId.value = id
  // 获取权限树
  const permList = await getPermissionList()
  permissionData.value = transListToTreeData(permList, 0)
  // 获取当前角色已选权限
  const { permIds } = await getRoleDetail(id)
  perIds.value = permIds
  showPermissionDialog.value = true
}

// 权限分配确定
const btnPermissionOK = async () => {
  const checkedKeys = permTreeRef.value?.getCheckedKeys() || []
  await assignPerm({
    id: currentRoleId.value,
    permIds: checkedKeys
  })
  ElMessage.success('角色分配权限成功')
  showPermissionDialog.value = false
}

onMounted(() => {
  getRole()
})
</script>

<template>
  <div class="container">
    <div class="app-container">
      <!-- 操作栏 -->
      <div class="role-operate">
        <el-button size="small" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>

      <!-- 角色表格 -->
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="name" width="200" align="center" label="角色">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="small" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="state" width="200" align="center" label="启用">
          <template #default="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" size="small" />
            <span v-else>{{ row.state === 1 ? '已启用' : row.state === 0 ? '未启用' : '无' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="description" align="center" label="描述">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="small" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300">
          <template #default="{ row }">
            <template v-if="row.isEdit">
              <el-button type="primary" size="small" @click="btnEditOK(row)">确定</el-button>
              <el-button size="small" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="small" link @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="small" link @click="btnEdit(row)">编辑</el-button>
              <el-popconfirm
                title="确定删除该角色吗？"
                @confirm="confirmDel(row.id)"
              >
                <template #reference>
                  <el-button size="small" link style="margin-left: 10px">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>

    <!-- 新增角色弹窗 -->
    <el-dialog
      v-model="showDialog"
      width="500px"
      title="新增角色"
      @close="btnCancel"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width: 300px" size="small" />
        </el-form-item>

        <el-form-item label="启用" prop="state">
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="small" />
        </el-form-item>

        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 300px" size="small" />
        </el-form-item>

        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="small" @click="btnOK">确定</el-button>
              <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 权限分配弹窗 -->
    <el-dialog
      v-model="showPermissionDialog"
      title="权限添加"
      width="600px"
    >
      <el-tree
        ref="permTreeRef"
        check-strictly
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        :default-checked-keys="perIds"
      />
      <template #footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPermissionOK">确定</el-button>
            <el-button size="small" @click="showPermissionDialog = false">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.role-operate {
  padding: 20px;
}
</style>