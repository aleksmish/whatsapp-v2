import Head from 'next/dist/shared/lib/head';
import styled from 'styled-components'
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import {collection,doc,getDoc, getDocs, orderBy, query, Query, setDoc} from 'firebase/firestore'
import {db,auth} from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { deepCopy } from '@firebase/util';
import getRecipientEmail from '../../utils/getRecipientEmail';
function Chat({chat,messages}) {
  const [user]=useAuthState(auth)

  return (
    <Container>
        <Head>
           <title>Chat with {getRecipientEmail(chat?.users,user)}</title> 
        </Head>
        <Sidebar />
        <ChatContainer>
            <ChatScreen chat={chat} messages={messages}/>
        </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context){
  const chatRef = doc(db,'chats',context.query.id);
   
  const chatDoc = await getDoc(chatRef,orderBy("timestamp","asc"))

  const chat = {
      id: chatDoc?.id,
      ...chatDoc?.data(),
  }

  const querySnapshot = await getDocs(collection(chatRef,'messages'))
  const messages = [];

  querySnapshot.forEach((doc) => {
      messages.push({

          id: doc.id,
          timestamp:doc.data().timestamp?.toDate().getTime(),
          ...doc.data(),

      })
      
  });

  return{
      props:{
          chat: JSON.parse(JSON.stringify(chat)),
          messages: JSON.parse(JSON.stringify(messages)),
      }
  }
    
}

const Container = styled.div`
display:flex;
`;

const ChatContainer = styled.div`
flex:1;
overflow:scroll;
height:100vh;

::-webkit-scrollbar{
    display:none;
}
-ms-overflow-style:none;
scrollbar-width:none;
`;
