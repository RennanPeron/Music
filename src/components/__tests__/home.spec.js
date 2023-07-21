import { shallowMount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'
import SongItem from '@/components/SongItem.vue'

describe('HomeView', () => {
  test('Render list of songs', () => {
    const songs = [{}, {}, {}]

    const component = shallowMount(Home, {
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

    const items = component.findAllComponents(SongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((item, index) => {
      expect(item.props().song).toStrictEqual(songs[index])
    })
  })
})
