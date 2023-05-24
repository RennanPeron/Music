<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-if="!show_form">
            <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click="remove">
                <i class="fa fa-times"></i>
            </button>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click="show_form = !show_form">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-else>
            <div class="text-white text-center font-bold p-4 mb-4" :class="alert_variant" v-if="show_alert">
                {{ alert_message }}
            </div>
            <vee-form :validation-schema="schema" @submit="edit" :initial-values="song">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field @input="updateUnsavedFlag(true)" type="text" name="modified_name"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title" />
                    <error-message class="text-red-600" name="modified_name" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field @input="updateUnsavedFlag(true)" type="text" name="genre"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre" />
                    <error-message class="text-red-600" name="genre" />
                </div>
                <button :disabled="in_submission" type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
                    Submit
                </button>
                <button :disabled="in_submission" type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
                    @click.prevent="show_form = show_alert = false; updateUnsavedFlag(false)">
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';
import { songsCollection } from "@/includes/firebase"
import { storage } from '@/includes/firebase';

export default {
    name: 'CompositionItem',
    props: {
        song: {
            type: Object,
            required: true
        },
        updateSongs: {
            type: Function,
            required: true
        },
        removeSong: {
            type: Function,
            required: true
        },
        updateUnsavedFlag: {
            type: Function,
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            show_form: false,
            schema: {
                modified_name: "required|max:50",
                genre: "alpha_spaces"
            },
            in_submission: false,
            show_alert: false,
            alert_variant: "bg-blue-400",
            alert_message: "Please wait! The song is being updated."
        }
    },
    methods: {
        async edit(values) {
            this.in_submission = this.show_alert = true
            this.alert_variant = "bg-blue-400"
            this.alert_message = "Please wait! The song is being updated."

            try {
                await songsCollection.doc(this.song.docID).update(values)
            } catch (err) {
                console.log(err)
                this.in_submission = false
                this.alert_variant = "bg-red-400"
                this.alert_message = "Something went wrong. Please try again later!"
                return
            }

            this.in_submission = false
            this.alert_variant = "bg-green-400"
            this.alert_message = "Song has been successfully updated."
            this.updateSongs(this.index, values)
            this.updateUnsavedFlag(false)
        },
        async remove() {
            const storageRef = storage.ref()
            const songRef = storageRef.child(`/songs/${this.song.original_name}`)

            await songRef.delete()

            await songsCollection.doc(this.song.docID).delete()

            this.removeSong(this.index)
        }
    },
    components: {
        ErrorMessage
    },
}
</script>