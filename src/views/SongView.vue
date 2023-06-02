<template>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
        <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
            style="background-image: url(/assets/img/song-header.png)"></div>
        <div class="container mx-auto flex items-center">
            <!-- Play/Pause Button -->
            <button @click.prevent="newSong(song)" type="button"
                class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                <i class="fas" :class="{ 'fa-play': !playButton, 'fa-pause': playButton }"></i>
            </button>
            <div class="z-50 text-left ml-8">
                <!-- Song Info -->
                <div class="text-3xl font-bold">{{ song.modified_name }}</div>
                <div>{{ song.genre }}</div>
            </div>
        </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <!-- Comment Count -->
                <span class="card-title">Comments ({{ song.comment_count }})</span>
                <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
                <comment-form :id="$route.params.id" @count_change="song.comment_count = comments.length + 1"
                    :getComments="getComments" :song="song" />
                <!-- Sort Comments -->
                <select
                    class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    v-model="sort">
                    <option value="1">Latest</option>
                    <option value="2">Oldest</option>
                </select>
            </div>
        </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
        <li class="p-6 bg-gray-50 border border-gray-200" v-for="commentary in sortedComments" :key="commentary.docID">
            <!-- Comment Author -->
            <div class="mb-5">
                <div class="font-bold">{{ commentary.author }}</div>
                <time>{{ updateTime(new Date(commentary.datePosted)) }}</time>
            </div>

            <p>
                {{ commentary.comment }}
            </p>
        </li>
    </ul>
</template>

<script>
import { songsCollection, commentsCollection } from "@/includes/firebase"

import { mapActions, mapState } from "pinia"
import usePlayerStore from '@/stores/player'

import CommentForm from "../components/CommentForm.vue"

export default {
    name: 'SongView',
    components: {
        CommentForm
    },
    data() {
        return {
            song: {},
            comments: [],
            sort: "1",
            currentDate: new Date()
        }
    },
    async created() {
        const docSnapshot = await songsCollection.doc(this.$route.params.id).get()

        if (!docSnapshot.exists) {
            this.$router.push({ name: 'home' })
            return
        }

        const { sort } = this.$route.query

        this.sort = sort === '1' || sort === '2' ? sort : '1'

        this.song = docSnapshot.data()

        this.getComments()
    },
    computed: {
        ...mapState(usePlayerStore, ["playing", "current_song"]),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if (this.sort === "1") {
                    return new Date(b.datePosted) - new Date(a.datePosted)
                } else
                    return new Date(a.datePosted) - new Date(b.datePosted)
            })
        },
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
        updateTime(date) {
            const diff = Math.floor((this.currentDate - date) / (1000 * 60)) || 0 // diferença em minutos
            const minutesInHour = 60
            const minutesInDay = 1440 // 60 minutos * 24 horas

            if (diff <= 1) {
                return 'Just now.'
            }

            return diff < minutesInHour ?
                `${diff} minutes ago.`
                : diff < minutesInDay ?
                    `${Math.floor(diff / minutesInHour)} hour${diff < minutesInHour * 2 ? '' : 's'} ago.`
                    : `${Math.floor(diff / minutesInDay)} day${diff < minutesInDay * 2 ? '' : 's'} ago.`

        }
    },
    watch: {
        sort(newVal) {
            if (newVal === this.$route.query.sort) {
                return
            }

            this.$router.push({
                query: {
                    sort: newVal
                }
            })
        }
    }
}
</script>
