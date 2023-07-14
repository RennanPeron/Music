import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidadePlugin from './includes/validate.js'
import { auth } from './includes/firebase.js'
import Icon from './directives/icon'
import i18n from './includes/i18n'
import GlobalComponents from './includes/_globals'

import './assets/base.css'
import './assets/main.css'

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidadePlugin)
    app.directive('icon', Icon)
    app.use(i18n)
    app.use(GlobalComponents)

    app.mount('#app')
  }
})
