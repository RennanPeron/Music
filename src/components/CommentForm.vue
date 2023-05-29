<template>
    <!-- Form -->
    <section class="container mx-auto mt-6">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <!-- Comment Count -->
                <span class="card-title">Comments ({{ song.comment_count }})</span>
                <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
                <div class="text-white text-center font-bold p-4 mb-4" :class="alert_variant" v-if="show_alert">
                    {{ alert_message }}
                </div>
                <vee-form :validation-schema="schema" @submit="addComment($event)">
                    <error-message class="text-red-600" name="comment" />
                    <vee-field as="textarea" name="comment"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                        placeholder="Your comment here..." />
                    <button :disabled="in_submission" type="submit"
                        class="py-1.5 px-3 rounded text-white bg-green-600 block">
                        Submit
                    </button>
                </vee-form>
                <!-- Sort Comments -->
                <select
                    class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                    <option value="1">Latest</option>
                    <option value="2">Oldest</option>
                </select>
            </div>
        </div>
    </section>
</template>

<script>
import { songsCollection, auth, commentsCollection, usersCollection } from "@/includes/firebase"

import useUserStore from "@/stores/user"
import { mapStores } from "pinia"

export default {
    name: 'CommentForm',
    props: {
        id: {
            type: String,
            required: true
        },
        song: {
            type: Object,
            required: true
        },
        updateComments: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            schema: {
                comment: 'required|min:3'
            },
            in_submission: false,
            alert_message: 'Please wait...',
            alert_variant: 'bg-blue-600',
            show_alert: false
        }
    },
    computed: {
        ...mapStores(useUserStore)
    },
    methods: {
        async addComment(value) {
            this.in_submission = this.show_alert = true
            this.alert_message = 'Please wait...'
            this.alert_variant = 'bg-blue-600'

            if (!this.userStore.userLoggedIn) {
                this.in_submission = false
                this.alert_message = 'You need to be logged in to comment!'
                this.alert_variant = 'bg-red-600'
                return
            }

            const userSnapshot = await usersCollection.doc(auth.currentUser.uid).get()
            const user = userSnapshot.data()

            try {
                const commentary = {
                    comment: value.comment,
                    author: user.name,
                    song_id: this.id,
                }

                // Adiciona o comentário ao BD
                await commentsCollection.add(commentary)

                this.$emit('count_change')

                // Adiciona +1 ao contador.
                await songsCollection.doc(this.id).update(this.song)

                this.updateComments(commentary)

                // Feedback ao usuário
                this.in_submission = false
                this.alert_message = 'Success!'
                this.alert_variant = 'bg-green-600'
            } catch (err) {
                this.in_submission = false
                this.alert_message = 'Error!'
                this.alert_variant = 'bg-red-600'
                return
            }

        }
    }
}
</script>