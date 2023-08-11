<template>
    <main>
        <!-- Introduction -->
        <section class="mb-8 py-20 text-white text-center relative">
            <div class="absolute inset-0 w-full h-full bg-cover introduction-bg"
                style="background-image: url(assets/img/header.png)"></div>
            <div class="container mx-auto">
                <div class="text-white main-header-content">
                    <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
                    <p class="w-full md:w-8/12 mx-auto">
                        {{ $t("home.welcome") }}
                    </p>
                </div>
            </div>

            <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="/assets/img/introduction-music.png" />
        </section>

        <!-- Main Content -->
        <section class="container mx-auto">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
                    v-icon-secondary="{ icon: 'headphones-alt', right: true }">
                    <span class="card-title">{{ $t("home.songs") }}</span>
                    <!-- Icon -->
                </div>
                <!-- Sort Songs -->
                <select
                    class="block w-32 ml-auto mr-3 mt-3 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    v-model="sort">
                    <option value="1">{{ $t("home.latest") }}</option>
                    <option value="2">{{ $t("home.oldest") }}</option>
                    <option value="3">{{ $t("home.relevance") }}</option>
                </select>
                <!-- Playlist -->
                <ol id="playlist">
                    <song-item :list="songs" :sort="sort" />
                </ol>
                <!-- .. end Playlist -->
            </div>
        </section>
    </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase'
import SongItem from "@/components/SongItem.vue"
import IconSecondary from '@/directives/icon-secondary'

export default {
    name: "HomeView",
    data() {
        return {
            songs: [],
            maxPerPage: 25,
            pendingRequests: false,
            sort: "1"
        }
    },
    components: {
        SongItem
    },
    directives: {
        'icon-secondary': IconSecondary
    },
    async created() {
        this.getSongs()

        window.addEventListener("scroll", this.handleScroll)
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    },
    methods: {
        async getSongs() {
            if (this.pendingRequests) {
                return
            }

            this.pendingRequests = true

            let snapshot
            if (this.songs.length) {
                const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get()

                snapshot = await songsCollection
                    .orderBy('modified_name')
                    .startAfter(lastDoc)
                    .limit(this.maxPerPage)
                    .get()
            } else {
                snapshot = await songsCollection
                    .orderBy('modified_name')
                    .limit(this.maxPerPage)
                    .get()
            }

            snapshot.forEach((document) => {
                this.songs.push({
                    docID: document.id,
                    ...document.data()
                })
            })

            this.pendingRequests = false
        },
        handleScroll() {
            const { scrollTop, offsetHeight } = document.documentElement
            const { innerHeight } = window

            const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

            if (bottomOfWindow) {
                this.getSongs()
            }
        }
    }
}
</script>