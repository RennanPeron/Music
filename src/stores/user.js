import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values) {
      // Entra com os valores do email e senha para o registro no banco de dados.
      const userCredential = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )

      // Valores para serem adicionados ao BD
      await usersCollection.doc(userCredential.user.uid).set({
        name: values.name,
        role: values.role,
        email: values.email,
        age: values.age,
        country: values.country
      })

      userCredential.user.updateProfile({
        displayName: values.name
      })

      // Autenticação
      this.userLoggedIn = true

      // Usando actions não precisa lidar com erros aqui e sim no componente
    }
  }
})
