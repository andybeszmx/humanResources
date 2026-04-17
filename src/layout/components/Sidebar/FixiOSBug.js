import { computed, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

export default {
  setup() {
     const appStore = useAppStore()
    const device = computed(() => appStore.device)

    const fixBugIniOS = () => {
      const $subMenu = this.$refs.subMenu 
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
      fixBugIniOS()
    })

    return {
      device,
      fixBugIniOS
    }
  }
}