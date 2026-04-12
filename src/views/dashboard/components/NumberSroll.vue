<template>
  <span>{{ displayNumber }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  endVal: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1000
  }
})

const displayNumber = ref(0)

const startCount = () => {
  const end = props.endVal || 0
  const start = 0
  const startTime = performance.now()
  const totalDuration = props.duration

  const run = () => {
    const elapsed = performance.now() - startTime
    const progress = Math.min(elapsed / totalDuration, 1)
    displayNumber.value = Math.floor(progress * (end - start) + start)

    if (progress < 1) {
      requestAnimationFrame(run)
    } else {
      displayNumber.value = end
    }
  }
  run()
}

watch(() => props.endVal, () => {
  startCount()
})

onMounted(() => {
  startCount()
})
</script>