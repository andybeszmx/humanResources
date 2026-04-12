<template>
  <!-- item.hidden为真不显示 -->
  <div v-if="!item.hidden" class="sidebar-item-container">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template v-slot:title>
        <!-- 渲染图标，文字 -->
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref, defineProps, defineOptions } from 'vue'
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
import AppLink from './Link.vue'
import FixiOSBug from './FixiOSBug'

// 保留原组件名和mixins
defineOptions({
  name: 'SidebarItem',
  mixins: [FixiOSBug]
})

// 定义props（与原代码一致）
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

// 替代原data中的onlyOneChild
const onlyOneChild = ref(null)

// 原methods中的hasOneShowingChild方法
const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })

  if (showingChildren.length === 1) {
    return true
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

// 原methods中的resolvePath方法
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  const base = props.basePath.endsWith('/') ? props.basePath : props.basePath + '/'
  return base + routePath
}
</script>

<style scoped>
/* 容器基础样式 */
.sidebar-item-container {
  width: 100%;
}

/* 关键：样式穿透覆盖Element菜单默认样式 */
/* 一级菜单背景 */
:deep(.el-menu-item) {
  background-color: #0a1629 !important; /* 侧边栏主背景色，匹配你的效果图 */
  color: #fff !important; /* 文字/图标白色 */
  height: 48px !important;
  line-height: 48px !important;
  margin: 0 !important; /* 去掉默认间距 */
}

/* 子菜单标题背景（el-sub-menu） */
:deep(.el-sub-menu__title) {
  background-color: #0a1629 !important;
  color: #fff !important;
  height: 48px !important;
  line-height: 48px !important;
}

/* 子菜单展开后的背景（nest-menu） */
.nest-menu {
  background-color: #162945 !important; /* 子菜单深色背景，略浅于主背景 */
}

/* 子菜单选项背景 */
:deep(.el-sub-menu .el-menu-item) {
  background-color: #162945 !important; /* 子菜单选项背景 */
  padding-left: 40px !important; /* 子菜单缩进，匹配效果图 */
}

/* 激活态/悬浮态背景 */
:deep(.el-menu-item.is-active),
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #1f365f !important; /* 高亮背景色 */
  color: #fff !important;
}

/* 原样式保留 */
.submenu-title-noDropdown {
  padding-left: 16px !important;
}
</style>