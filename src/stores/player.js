import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    progress_bar: '0%'
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload()
        this.current_song = {}
      }

      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true
      })

      this.sound.play()

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      // Playing é uma função que retorna true ou false. Usando sem os parenteses (), o JS checa se ela existe, ou seja se é um objeto do tipo Howler, oq significa que o usuário já selecionou uma musica anteriormente.
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) this.sound.pause()
      else this.sound.play()
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())

      this.progress_bar = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }

      // Document = 2000 | Timeline = 1000, clickX = 1000 <- Valor errado, precisa compensar a distancia da timeline com a do document
      // Distancia = 500, ClickX - Distancia = 500 <- valor correto!
      const { x, width } = event.currentTarget.getBoundingClientRect() // X = Distancia
      const clickX = event.clientX - x

      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.progress)
    }
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    }
  }
})
