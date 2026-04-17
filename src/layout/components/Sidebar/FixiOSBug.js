import { computed, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

export default {
  setup() {
     const appStore = useAppStore()
    const device = computed(() => appStore.device)

    const fixBugIniOS = () => {
      const $subMenu = this.$refs.subMenu // Vue3 中 ref 需要通过模板 ref 获取，此处保持逻辑不变
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (device.value === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }

    onMounted(() => {
      // 修复iOS设备点击菜单触发mouseleave的bug
      // https://github.com/PanJiaChen/vue-element-admin/issues/1135
      fixBugIniOS()
    })

    return {
      device,
      fixBugIniOS
    }
  }
}