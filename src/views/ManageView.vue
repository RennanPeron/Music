<template>
    <main>
        <!-- Main Content -->
        <section class="container mx-auto mt-6">
            <div class="md:grid md:grid-cols-3 md:gap-4">
                <div class="col-span-1">
                    <app-upload :addSong="addSong" />
                </div>
                <div class="col-span-2">
                    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                            <span class="card-title">{{ $t("manage.my_songs") }}</span>
                            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                        </div>
                        <div class="p-6">
                            <!-- Composition Items -->
                            <composition-item v-for="(song, i) in songs" :key="song.docID" :song="song"
                                :updateSongs="updateSongs" :removeSong="removeSong" :updateUnsavedFlag="updateUnsavedFlag"
                                :index="i" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
// import useUserStore from "@/stores/user"

import AppUpload from '@/components/AppUpload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';

export default {
    name: "ManageView",
    components: {
        AppUpload,
        CompositionItem
    },
    data() {
        return {
            songs: [],
            unsaved_flag: false
        }
    },
    async beforeRouteEnter(to, from, next) {
        const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

        next((vm => {
            snapshot.forEach(vm.addSong)
        }))
    },
    methods: {
        updateSongs(index, values) {
            this.songs[index].modified_name = values.modified_name
            this.songs[index].genre = values.genre
        },
        removeSong(index) {
            this.songs.splice(index, 1)
        },
        addSong(document) {
            const song = {
                ...document.data(),
                docID: document.id
            }

            this.songs.push(song)
        },
        updateUnsavedFlag(result) {
            this.unsaved_flag = result
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.unsaved_flag) {
            next()
        } else {
            const leave = confirm("You have unsaved changes. Are you sure you want to leave?")
            next(leave)
        }
    }
    // beforeRouteEnter(to, from, next) {
    //     const user = useUserStore()

    //     if (user.userLoggedIn) {
    //         next()
    //     } else {
    //         next({ name: "home" })
    //     }
    // }
}
</script>