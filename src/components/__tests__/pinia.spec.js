import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'

vi.mock('@/includes/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: () => {
      Promise.resolve
    },
    signOut: () => {
      Promise.resolve
    }
  }
}))

describe('Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('authenticates and logout user', async () => {
    const user = useUserStore()

    expect(user.userLoggedIn).toBe(false)

    await user.authenticate({})
    expect(user.userLoggedIn).toBe(true)

    await user.signOut()
    expect(user.userLoggedIn).toBe(false)
  })
})
