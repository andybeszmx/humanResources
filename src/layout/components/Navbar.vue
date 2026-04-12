<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { updatePassword } from '@/api/user'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'NavbarIndex'
})

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const isShow = ref(false)
const passFormRef = ref(null)
const passForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '长度 6-16 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '重复密码不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (passForm.value.newPassword === value) {
          callback()
        } else {
          callback(new Error('两次密码不一致'))
        }
      }
    }
  ]
})

const sidebar = computed(() => appStore.sidebar)
const avatar = computed(() => userStore.avatar)
const name = computed(() => userStore.name)

const updatePasswordModal = () => {
  isShow.value = true
}

const toggleSideBar = () => {
  appStore.toggleSideBar()
}

const logout = async () => {
  await userStore.logout()
  router.push('/login')
}

const btnOk = async () => {
  await passFormRef.value.validate()
  await updatePassword(passForm.value)
  ElMessage.success('修改成功')
  btnCancel()
}

const btnCancel = () => {
  passFormRef.value?.resetFields()
  isShow.value = false
}
</script>

<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggle-click="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>

        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click="updatePasswordModal">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="logout">Log Out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 这里是 Element Plus 唯一必须改的语法：v-model:visible -->
    <el-dialog width="500px" title="修改密码" v-model:visible="isShow" @close="btnCancel">
      <el-form ref="passFormRef" label-width="120px" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="btnOk">确认修改</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .username {
          height: 30px;
          width: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #259b52;
          border-radius: 50%;
          color:#fff;
        }

        .name {
          margin-right:10px ;
          margin-left:10px ;
        }

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>