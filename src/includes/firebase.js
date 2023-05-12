import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCVDnr4KqgJUXBxayfWWXYtNLYzwKx1zkI',
  authDomain: 'music-17504.firebaseapp.com',
  projectId: 'music-17504',
  storageBucket: 'music-17504.appspot.com',
  appId: '1:782680322123:web:1fada60d42ad9bddac9dce'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

export { auth }
