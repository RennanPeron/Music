import { shallowMount } from '@vue/test-utils'
import Manage from '@/views/ManageView.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import Upload from '@/components/AppUpload.vue'

describe('ManageView', () => {
  test('Render user songs', () => {
    const songs = [{}, {}, {}]

    const wrapper = shallowMount(Manage, {
      data() {
        return {
          songs
        }
      },
      global: {
        mocks: {
          $t: (message) => message
        }
      }
    })

    const items = wrapper.findAllComponents(CompositionItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((item, index) => {
      expect(item.props().song).toStrictEqual(songs[index])
    })
  })

  test('render uploads', () => {
    const uploads = [{}, {}, {}]

    const wrapper = shallowMount(Upload, {
      data() {
        return {
          uploads
        }
      },
      global: {
        mocks: {
          $t: (message) => message
        }
      }
    })

    const items = wrapper.findAll('.uploaded-songs')

    expect(items).toHaveLength(uploads.length)
  })
})
