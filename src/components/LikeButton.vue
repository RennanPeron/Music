<template>
    <button type="button"
        class="z-50 h-10 w-20 bg-white text-black rounded-full focus:outline-none flex items-center justify-center gap-2"
        :class="animate" @click.prevent="addLikeList">
        <i class="text-xl" :class="icon"></i>
        <span>{{ song.like_count }}</span>
    </button>
</template>

<script>
import { likesCollection, songsCollection, auth } from '../includes/firebase'

import useUserStore from '@/stores/user'
import { mapState } from 'pinia'

export default {
    name: 'LikeButton',
    props: {
        song_id: {
            type: String,
            required: true
        },
        song: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            icon: 'far fa-heart',
            liked: false,
            animate: '',
        }
    },
    async beforeMount() {
        const snapshot = await likesCollection.where('songId', '==', this.song_id).where('userId', '==', auth.currentUser.uid).get()

        snapshot.forEach(el => {
            if (el) {
                this.icon = 'fas fa-heart'
                this.liked = true
            }
        })
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

            if (this.liked) {
                return
            }

            try {
                const like = {
                    userId: auth.currentUser.uid,
                    songId: this.song_id
                }

                await likesCollection.add(like)

                this.$emit('like_increment')

                this.icon = 'fas fa-heart'

                await songsCollection.doc(this.song_id).update(this.song)
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style>
.animate__shakeX {
    animation-duration: 1.2s;
}
</style>