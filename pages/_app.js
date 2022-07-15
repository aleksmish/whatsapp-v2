import '../styles/globals.css'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth,db,app} from '../firebase.js'
import Login from './login'
import Loading from '../components/Loading'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react'
import { collection,addDoc,serverTimestamp,setDoc,doc} from 'firebase/firestore'

function MyApp({ Component, pageProps }) {
  const [user,loading]=useAuthState(auth)

  useEffect(()=>{
    if(user){
      setDoc(doc(db,'users',user.email),{
        email:user.email,
        lastSeen: serverTimestamp(),
        photoURL:user.photoURL
      },{merge:true}).catch(err=>console.log(err))
    }
  }, [user])

  if(loading) return <Loading/>

  if(!user) return <Login/>

  return <Component {...pageProps} />
}

export default MyApp
