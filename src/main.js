import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidadePlugin from './includes/validate.js'
import { auth } from './includes/firebase.js'
import i18n from './includes/i18n'
import Icon from './directives/icon'

import './assets/base.css'
import './assets/main.css'

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidadePlugin)
    app.use(i18n)
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
