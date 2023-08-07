<template>
    <button type="button"
        class="z-50 h-10 w-20 bg-white text-black rounded-full focus:outline-none flex items-center justify-center gap-2"
        :class="animate" @click.prevent="addLikeList">
        <i class="text-xl" :class="icon"></i>
        <span>{{ song.like_count }}</span>
    </button>
</template>

<script>
import useUserStore from '@/stores/user'
import { mapState } from 'pinia'

export default {
    name: 'LikeButton',
    props: ['song'],
    data() {
        return {
            icon: 'far fa-heart',
            animate: ''
        }
    },
    computed: {
        ...mapState(useUserStore, ['userLoggedIn'])
    },
    methods: {
        async addLikeList() {
            this.animate = ""
            if (!this.userLoggedIn) {
                this.animate = 'animate_animate animate__shakeX'
                return
            }

            // this.song.like_count++

            // try {
            //      const user = await usersCollection.doc(`${auth.currentUser.uid}`)
            //      console.log(user)
            // } catch (e) {
            //     console.log(e)
            // }
        }
    }
}
</script>

<style>
.animate__shakeX {
    animation-duration: 1.2s;
}
</style>