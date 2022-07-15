import {initializeApp} from 'firebase/app';
import {collection, getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'; 

const firebaseConfig = {
    apiKey: "AIzaSyDSi3azJc8X-aAVU2cGyQOo4k5KiyANLfI",
    authDomain: "whatsapp-2-288c5.firebaseapp.com",
    projectId: "whatsapp-2-288c5",
    storageBucket: "whatsapp-2-288c5.appspot.com",
    messagingSenderId: "526474523856",
    appId: "1:526474523856:web:b9347b671d79386d2b1ad5"
  };

const app=initializeApp(firebaseConfig)

const db=getFirestore(app);

const auth=getAuth(app);
const provider=new GoogleAuthProvider();


export {db,auth,provider,app};