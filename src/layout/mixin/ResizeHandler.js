import { onBeforeMount, onBeforeUnmount, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

const { body } = document
const WIDTH = 992 // 参考Bootstrap响应式设计

export default {
  setup() {
    const store = useStore()
    const $_isMobile = () => {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    }

    const $_resizeHandler = () => {
      if (!document.hidden) {
        const isMobile = $_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }

    // 监听路由变化
    watch(
      () => window.$route,
      (route) => {
        const device = store.state.app.device
        const sidebar = store.state.app.sidebar
        if (device === 'mobile' && sidebar.opened) {
          store.dispatch('app/closeSideBar', { withoutAnimation: false })
        }
      },
      { immediate: true }
    )

    onBeforeMount(() => {
      window.addEventListener('resize', $_resizeHandler)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', $_resizeHandler)
    })

    onMounted(() => {
      const isMobile = $_isMobile()
      if (isMobile) {
        store.dispatch('app/toggleDevice', 'mobile')
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    })

    return {
      $_isMobile,
      $_resizeHandler
    }
  }
}