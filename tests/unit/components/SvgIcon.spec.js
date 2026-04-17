import { shallowMount } from '@vue/test-utils'
import SvgIcon from '@/components/SvgIcon/index.vue'

describe('SvgIcon.vue', () => {
  it('iconClass', () => {
    const wrapper = shallowMount(SvgIcon, {
      props: { iconClass: 'test' }
    })
    expect(wrapper.find('use').attributes('href')).toBe('#icon-test')
  })

  it('className', async () => {
    const wrapper = shallowMount(SvgIcon, {
      props: { iconClass: 'test' }
    })
    
    // 初始状态应有 'svg-icon' 类
    expect(wrapper.classes()).toContain('svg-icon')
    expect(wrapper.classes()).toHaveLength(1)
    
    // 设置 className 属性，并等待 DOM 更新
    await wrapper.setProps({ className: 'test' })
    
    // 现在 classes 应包含 'test'
    expect(wrapper.classes()).toContain('test')
    expect(wrapper.classes()).toContain('svg-icon')
  })
})