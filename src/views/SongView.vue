<template>
    <main>
        <!-- Music Header -->
        <section class="w-full mb-8 py-14 text-center text-white relative">
            <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
                style="background-image: url(/assets/img/song-header.png)"></div>
            <div class="container mx-auto flex items-center justify-between">
                <div class="container mx-auto flex items-center">
                    <!-- Play/Pause Button -->
                    <button id="play-btn" @click.prevent="newSong(song)" type="button"
                        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                        <i class="fas" :class="{ 'fa-play': !playButton, 'fa-pause': playButton }"></i>
                    </button>
                    <div class="z-50 text-left ml-8">
                        <!-- Song Info -->
                        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
                        <div>{{ song.genre }}</div>
                    </div>
                </div>
                <like-button :song="song" :song_id="$route.params.id" @like_increment="song.like_count += 1"
                    @like_decrement="song.like_count -= 1" />
            </div>
        </section>
        <!-- Form -->
        <section class="container mx-auto mt-6">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                    <!-- Comment Count -->
                    <span class="card-title">{{ $tc("song.comment_count", song.comment_count, { count: song.comment_count })
                    }}</span>
                    <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
                </div>
                <div class="p-6">
                    <comment-form :id="$route.params.id" @count_change="song.comment_count = comments.length + 1"
                        :getComments="getComments" :song="song" />
                    <!-- Sort Comments -->
                    <select
                        class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        v-model="sort">
                        <option value="1">{{ $t('home.latest') }}</option>
                        <option value="2">{{ $t('home.oldest') }}</option>
                    </select>
                </div>
            </div>
        </section>
        <!-- Comments -->
        <ul class="container mx-auto" id="comments">
            <comment-item :list="comments" :sort="sort" />
        </ul>
    </main>
</template>

<script>
import { songsCollection, commentsCollection } from "@/includes/firebase"

import { mapActions, mapState } from "pinia"
import usePlayerStore from '@/stores/player'

import CommentForm from "@/components/CommentForm.vue"
import LikeButton from "@/components/LikeButton.vue"
import CommentItem from "../components/CommentItem.vue"

export default {
    name: 'SongView',
    components: {
        CommentForm,
        LikeButton,
        CommentItem
    },
    data() {
        return {
            song: {},
            comments: [],
            sort: "1",
            timeType: ''
        }
    },
    async beforeRouteEnter(to, from, next) {
        const docSnapshot = await songsCollection.doc(to.params.id).get()

        next((vm) => {
            if (!docSnapshot.exists) {
                vm.$router.push({ name: 'home' })
                return
            }

            const { sort } = vm.$route.query

            vm.sort = sort === '1' || sort === '2' ? sort : '1'

            vm.song = docSnapshot.data()

            vm.getComments()
        })

    },
    computed: {
        ...mapState(usePlayerStore, ["playing", "current_song"]),
        playButton() {
            if (this.current_song.modified_name != this.song.modified_name) {
                return false
            }

            return this.playing
        }
    },
    methods: {
        ...mapActions(usePlayerStore, ["newSong"]),
        async getComments() {
            const commentSnapshot = await commentsCollection.where('song_id', '==', this.$route.params.id).get()

            this.comments = []

            commentSnapshot.forEach((document) => {
                this.comments.push({
                    docID: document.id,
                    ...document.data()
                })
            })
        },
    }
}
</script>