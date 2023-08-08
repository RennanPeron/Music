<template>
    <button type="button"
        class="z-50 h-10 w-20 bg-white text-black rounded-full focus:outline-none flex items-center justify-center gap-2"
        :class="animate" @click.prevent="addLikeList" :disabled="in_submission">
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
            in_submission: false
        }
    },
    async beforeMount() {
        const snapshot = await likesCollection.where('songId', '==', this.song_id).where('userId', '==', auth.currentUser.uid).get()

        snapshot.forEach(el => {
            if (el) {
                this.liked = el.id
                this.icon = 'fas fa-heart'
            }
        })

    },
    computed: {
        ...mapState(useUserStore, ['userLoggedIn'])
    },
    methods: {
        async addLikeList() {
            this.in_submission = true

            this.animate = ""
            if (!this.userLoggedIn) {
                this.animate = 'animate_animate animate__shakeX'
                this.in_submission = false
                return
            }

            // Dislike
            if (this.liked) {
                try {
                    await likesCollection.doc(this.liked).delete()
                    this.icon = 'far fa-heart'

                    this.$emit('like_decrement')
                    await songsCollection.doc(this.song_id).update(this.song)

                    this.liked = false
                } catch (e) {
                    console.log(e)
                }
                this.in_submission = false
                return
            }

            // Like
            try {
                const like = {
                    userId: auth.currentUser.uid,
                    songId: this.song_id
                }

                await likesCollection.add(like)

                this.$emit('like_increment')

                this.icon = 'fas fa-heart'

                await songsCollection.doc(this.song_id).update(this.song)

                await this.getLikeId()
                this.in_submission = false
            } catch (e) {
                console.log(e)
            }

        },
        async getLikeId() {
            const snapshot = await likesCollection.where('songId', '==', this.song_id).where('userId', '==', auth.currentUser.uid).get()

            snapshot.forEach(el => {
                if (el) {
                    this.liked = el.id
                }
            })
        }
    }
}
</script>

<style>
.animate__shakeX {
    animation-duration: 1.2s;
}
</style>