import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'

vi.mock('@/includes/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: () => {
      Promise.resolve
    }
  }
}))

describe('stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('authenticates user', async () => {
    const user = useUserStore()

    expect(user.userLoggedIn).toBe(false)

    await user.authenticate({})
    expect(user.userLoggedIn).toBe(true)
  })
})
