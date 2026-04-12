<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router' // Vue3 官方路由钩子
import { useAppStore } from '@/store/modules/app' // 引入app store
import { useSettingsStore } from '@/store/modules/settings' // 引入settings store
import { useUserStore } from '@/store/modules/user' // 引入user store
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import * as variables from '@/styles/variables.scss'

defineOptions({
  name: 'SidebarIndex'
})

// 获取 Pinia Store 实例
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
// 获取当前路由（Vue3 正确方式）
const route = useRoute()

// 计算属性 - 侧边栏状态
const sidebar = computed(() => appStore.sidebar)
// 计算属性 - 路由列表（从user store获取）
const routes = computed(() => userStore.routes)
// 计算属性 - 激活的菜单
const activeMenu = computed(() => {
  const { meta, path } = route
  // 可选链防止meta不存在时报错
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})
// 计算属性 - 是否显示logo
const showLogo = computed(() => settingsStore.sidebarLogo)
// 计算属性 - 是否折叠侧边栏
const isCollapse = computed(() => !sidebar.value.opened)
</script>

<template>
  <div :class="{'has-logo': showLogo}">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 增加空值判断，避免无效路由渲染 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path || route.name"
          :item="route"
          :base-path="route.path"
          v-if="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>