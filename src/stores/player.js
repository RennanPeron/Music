import { defineStore } from 'pinia'
import { Howl } from 'howler'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {}
  }),
  actions: {
    async newSong(song) {
      if (this.sound.playing) {
        this.sound.stop()
        this.current_song = this.sound = {}
      }

      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true
      })

      this.sound.play()
    },
    async toggleAudio() {
      // Playing é uma função que retorna true ou false. Usando sem os parenteses (), o JS checa se ela existe, ou seja se é um objeto do tipo Howler, oq significa que o usuário já selecionou uma musica anteriormente.
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) this.sound.pause()
      else this.sound.play()
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
