export default {
  data() {
    return {
      currentDate: new Date()
    }
  },
  props: {
    list: {
      required: true,
      type: Array
    },
    sort: {
      require: true,
      type: String
    }
  },
  methods: {
    getTimeDiff(date) {
      const diff = Math.floor((this.currentDate - date) / (1000 * 60)) || 0 // diferença em minutos
      const minutesInHour = 60
      const minutesInDay = 1440 // 60 minutos * 24 horas

      if (this.$i18n.locale === 'pt') {
        if (diff <= 1) {
          return 'Agora pouco'
        }
        return diff < minutesInHour
          ? `${diff} minutos atrás.`
          : diff < minutesInDay
          ? `${Math.floor(diff / minutesInHour)} hora${diff < minutesInHour * 2 ? '' : 's'} atrás.`
          : `${Math.floor(diff / minutesInDay)} dia${diff < minutesInDay * 2 ? '' : 's'} atrás.`
      } else {
        if (diff <= 1) return 'Just now'
        return diff < minutesInHour
          ? `${diff} minutes ago.`
          : diff < minutesInDay
          ? `${Math.floor(diff / minutesInHour)} hour${diff < minutesInHour * 2 ? '' : 's'} ago.`
          : `${Math.floor(diff / minutesInDay)} day${diff < minutesInDay * 2 ? '' : 's'} ago.`
      }
    }
  },
  computed: {
    sortedList() {
      return this.list.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        if (this.sort === '2') {
          return new Date(a.datePosted) - new Date(b.datePosted)
        } else return b.like_count * 2 + b.comment_count - (a.like_count * 2 + a.comment_count)
      })
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
