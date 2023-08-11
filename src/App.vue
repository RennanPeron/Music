<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component">
      </component>
    </transition>
  </router-view>

  <app-player />

  <app-auth />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/AppPlayer.vue'
import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user'
import { auth, usersCollection } from './includes/firebase';
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
  async created() {
    if (auth.currentUser) {
      this.userLoggedIn = true

      try {
        const snapshot = await usersCollection.doc(auth.currentUser.uid).get()

        if (snapshot.exists) {
          if (snapshot.data().country == "Brazil")
            this.$i18n.locale = 'pt'
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.2s linear;
}

.fade-leave-to {
  transition: all 0.2s linear;
  opacity: 0;
}
</style>