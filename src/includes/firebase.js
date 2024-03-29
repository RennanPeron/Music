import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCVDnr4KqgJUXBxayfWWXYtNLYzwKx1zkI',
  authDomain: 'music-17504.firebaseapp.com',
  projectId: 'music-17504',
  storageBucket: 'music-17504.appspot.com',
  appId: '1:782680322123:web:1fada60d42ad9bddac9dce'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence failed: ${error.code}`)
})

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export { auth, db, usersCollection, songsCollection, commentsCollection, likesCollection, storage }
