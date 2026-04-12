<script setup>
defineOptions({
  name:'ItemIndex'
})
defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <!-- 图标逻辑：完全和原渲染函数一致 -->
  <i
    v-if="icon && icon.includes('el-icon')"
    :class="[icon, 'sub-el-icon']"
  />
  <svg-icon
    v-else-if="icon"
    :icon-class="icon"
  />

  <!-- 标题逻辑：完全和原逻辑一致，移除废弃的slot属性（Element Plus已不再需要） -->
  <span v-if="title">{{ title }}</span>
</template>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>