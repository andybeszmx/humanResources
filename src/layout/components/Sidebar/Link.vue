<script setup>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

// 关键：变量名不和导入的 isExternal 重名
const isExt = computed(() => isExternal(props.to))
</script>

<template>
  <a
    v-if="isExt"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<style scoped></style>