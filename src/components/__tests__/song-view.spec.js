import { shallowMount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SongView from '@/views/SongView.vue'

describe('SongView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('render song comments', () => {
    const comments = [{}, {}, {}]

    const wrapper = shallowMount(SongView, {
      data() {
        return {
          comments
        }
      },
      global: {
        mocks: {
          $tc: (message) => message,
          $route: { params: { id: '' } },
          $i18n: { locale: 'en' }
        }
      }
    })

    expect(wrapper.findAll('.comment-item')).toHaveLength(comments.length)
  })
})
