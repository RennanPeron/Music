<template>
    <vee-form :validation-schema="schema" @submit="addComment">
        <div class="text-white text-center font-bold p-4 mb-4" :class="alert_variant" v-if="show_alert">
            {{ alert_message }}
        </div>
        <p v-if="textarea" class="text-red-600">You need to be logged in to comment.</p>
        <ErrorMessage v-else class="text-red-600" name="comment" />
        <vee-field as="textarea" name="comment" :disabled="textarea" @focus="checkAuth"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..." />
        <button :disabled="in_submission" type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block">
            Submit
        </button>
    </vee-form>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase"

import { mapState } from "pinia"
import useUserStore from "@/stores/user"

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
        getComments: {
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
            alert_variant: 'bg-blue-500',
            show_alert: false,
            textarea: false,
        }
    },
    computed: {
        ...mapState(useUserStore, ["userLoggedIn"])
    },
    methods: {
        async addComment(values, { resetForm }) {
            this.in_submission = this.show_alert = true
            this.alert_message = 'Please wait...'
            this.alert_variant = 'bg-blue-500'

            if (!this.userLoggedIn) {
                this.in_submission = false
                this.alert_message = 'You need to be logged in to comment!'
                this.alert_variant = 'bg-red-500'
                return
            }

            try {
                const commentary = {
                    comment: values.comment,
                    datePosted: new Date().toString(),
                    author: auth.currentUser.displayName,
                    uid: auth.currentUser.uid,
                    song_id: this.id,
                }

                // Adiciona o comentário ao BD
                await commentsCollection.add(commentary)

                resetForm()

                this.getComments()

                this.$emit('count_change')

                // Adiciona +1 ao contador.
                await songsCollection.doc(this.id).update(this.song)

                // Feedback ao usuário
                this.in_submission = false
                this.alert_message = 'Success!'
                this.alert_variant = 'bg-green-500'
            } catch (err) {
                this.in_submission = false
                this.alert_message = 'Error!'
                this.alert_variant = 'bg-red-500'
                return
            }

        },
        checkAuth() {
            if (!this.userLoggedIn) {
                this.textarea = true
            }
        }
    }
}
</script>