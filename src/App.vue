<template>
  <app-header />

  <router-view />

  <app-player />

  <app-auth />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/AppPlayer.vue'
import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user'
import { auth } from './includes/firebase';
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
    RouterView
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>