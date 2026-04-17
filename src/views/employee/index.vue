<template>
  <div class="container">
    <div class="app-container">
      <!-- 左侧部门树 -->
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          link
          :prefix-icon="Search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <el-tree
          ref="deptTreeRef"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        />
      </div>

      <!-- 右侧员工列表 -->
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="small" type="primary" @click="router.push('/employee/detail')">添加员工</el-button>
          <el-button size="small" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="small" @click="exportEmployeeData">excel导出</el-button>
        </el-row>

        <el-table :data="list" border style="width: 100%">
          <!-- 头像列 -->
          <el-table-column prop="staffPhoto" align="center" label="头像" width="80">
            <template #default="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="username" label="姓名" align="center" />
          <el-table-column prop="mobile" label="手机号" align="center" sortable />
          <el-table-column prop="workNumber" label="工号" align="center" sortable />

          <!-- 聘用形式列 -->
          <el-table-column prop="formOfEmployment" label="聘用形式" align="center">
            <template #default="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column prop="departmentName" label="部门" align="center" />
          <el-table-column prop="timeOfEntry" label="入职时间" align="center" sortable />

          <!-- 操作列 -->
          <el-table-column label="操作" width="280" align="center">
            <template #default="{ row }">
              <el-button size="small" link @click="router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="small" link @click="roleChoose(row.id)">角色</el-button>
              <el-popconfirm
                title="确定删除该员工吗？"
                @confirm="confirmDel(row.id)"
              >
                <template #reference>
                  <el-button size="small" link style="margin-left:10px">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>

    <!-- Excel导入组件 -->
    <ImportExcel
      v-model:show-excel-dialog="showExcelDialog"
      @uploadSuccess="getEmployeeList"
    />

    <!-- 角色选择弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="角色选择"
      width="500px"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnRoleOK">确定</el-button>
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getDepartment } from '@/api/department'
import { getEmployeeList, exportEmployee, delEmployee, getEnabledRoleList, getEmployeeDetail, assignRoles } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'

const router = useRouter()

const depts = ref([])
const defaultProps = {
  label: 'name',
  children: 'children'
}
const queryParams = reactive({
  departmentId: null,
  page: 1,
  pagesize: 10,
  keyword: ''
})
const total = ref(0)
const list = ref([])
const showExcelDialog = ref(false)
const dialogVisible = ref(false)
const roleList = ref([])
const roleIds = ref([])
const currentId = ref(null)

// 表单ref
const deptTreeRef = ref(null)

// 定时器
let timer = null

// 获取部门树
const getDepartmentList = async () => {
  const res = await getDepartment()
  depts.value = transListToTreeData(res, 0)
  queryParams.departmentId = depts.value[0].id
  
  // 等待树渲染完成，设置默认选中
  nextTick(() => {
    deptTreeRef.value?.setCurrentKey(queryParams.departmentId)
  })
  
  getEmployee()
}

// 树节点切换
const selectNode = (node) => {
  queryParams.departmentId = node.id
  queryParams.page = 1
  getEmployee()
}

// 获取员工列表
const getEmployee = async () => {
  const { rows, total: totalCount } = await getEmployeeList(queryParams)
  list.value = rows
  total.value = totalCount
}

// 分页切换
const changePage = (newPage) => {
  queryParams.page = newPage
  getEmployee()
}

// 模糊搜索（防抖）
const changeValue = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    queryParams.page = 1
    getEmployee()
  }, 800)
}

// 导出Excel
const exportEmployeeData = async () => {
  const res = await exportEmployee()
  FileSaver.saveAs(res, '员工信息表.xlsx')
}

// 删除员工
const confirmDel = async (id) => {
  await ElMessageBox.confirm('确定删除该员工吗？', '提示', { type: 'warning' })
  await delEmployee(id)
  ElMessage.success('删除员工成功')
  
  // 删除最后一页最后一条时，页码减1
  if (list.value.length === 1 && queryParams.page > 1) {
    queryParams.page--
  }
  getEmployee()
}

// 打开角色选择弹窗
const roleChoose = async (id) => {
  currentId.value = id
  roleList.value = await getEnabledRoleList()
  const { roleIds: ids } = await getEmployeeDetail(id)
  roleIds.value = ids
  dialogVisible.value = true
}

// 角色分配确定
const btnRoleOK = async () => {
  await assignRoles({ id: currentId.value, roleIds: roleIds.value })
  ElMessage.success('角色分配成功')
  dialogVisible.value = false
}

onMounted(() => {
  getDepartmentList()
})
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>