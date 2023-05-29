<template>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
        <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
            style="background-image: url(/assets/img/song-header.png)"></div>
        <div class="container mx-auto flex items-center">
            <!-- Play/Pause Button -->
            <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                <i class="fas fa-play"></i>
            </button>
            <div class="z-50 text-left ml-8">
                <!-- Song Info -->
                <div class="text-3xl font-bold">{{ song.modified_name }}</div>
                <div>{{ song.genre }}</div>
            </div>
        </div>
    </section>
    <comment-form :id="$route.params.id" @count_change="song.comment_count++" :updateComments="updateComments"
        :song="song" />
    <!-- Comments -->
    <ul class="container mx-auto" v-for="commentary in comments" :key="commentary.docID">
        <li class="p-6 bg-gray-50 border border-gray-200">
            <!-- Comment Author -->
            <div class="mb-5">
                <div class="font-bold">{{ commentary.author }}</div>
                <time>5 mins ago</time>
            </div>

            <p>
                {{ commentary.comment }}
            </p>
        </li>
    </ul>
</template>

<script>
import { songsCollection, commentsCollection } from "@/includes/firebase"

import CommentForm from "../components/CommentForm.vue"

export default {
    name: 'SongView',
    components: {
        CommentForm
    },
    data() {
        return {
            song: {},
            comments: []
        }
    },
    async created() {
        const docSnapshot = await songsCollection.doc(this.$route.params.id).get()

        if (!docSnapshot.exists) {
            this.$router.push({ name: 'home' })
            return
        }

        this.song = docSnapshot.data()

        this.getComments()

    },
    methods: {
        async getComments() {
            const commentSnapshot = await commentsCollection.where('song_id', '==', this.$route.params.id).get()

            commentSnapshot.forEach((document) => {
                const comment = {
                    ...document.data(),
                    docID: document.id
                }
                this.comments.push(comment)
            })
        },
        updateComments(comment) {
            this.comments.unshift(comment)
        }
    }
}
</script>
