import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components'
import {auth, db} from '../firebase'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile'
import AttachFile from '@material-ui/icons/AttachFile';
import {useCollection,useCollectionData,useDocumentData} from 'react-firebase-hooks/firestore'
import {collection,doc, orderBy, query, serverTimestamp, setDoc,addDoc, getDocs,getDoc, collectionGroup, where} from 'firebase/firestore'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { useRef, useState } from 'react';
import Message from './Message'
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';


function ChatScreen({chat,messages}) {
  const [user] = useAuthState(auth)
  
  const[input,setInput]=useState('')
  const router=useRouter();

  const [messagesSnapshot]=useCollection(query(collection(db,'chats',router.query.id,'messages'),orderBy('timestamp','asc')))
  const [recipientSnapshot]=useCollection(query(collection(db,'users'),where('email', '==', getRecipientEmail(chat.users,user))))
  const endOfMessageRef=useRef()

  const scrollToBottom=()=>{
    endOfMessageRef.current.scrollIntoView({
      behavior:'smooth',
      block:"start",
    })
  }

  const showMessages=()=>{
    if(messagesSnapshot){
      return messagesSnapshot?.docs?.map(message=>
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
        />
      )
    } else {
      return messages.map(message=>
        <Message key={message.id} user={message.user} message={message}/>
      )
    }
  }

  const sendMessage=(e)=>{
    e.preventDefault();

    // update the last seen...
    setDoc(doc(db,'users',user.email),{
      lastSeen:  serverTimestamp()
    },{merge:true})
    

    addDoc(collection(db,'chats',router.query.id,'messages'),{
      timestamp: serverTimestamp(),
      message:input,
      user:user.email,
      photoURL:user.photoURL,
    });


    setInput('');
    scrollToBottom()
  }
  
  const recipient=recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail=getRecipientEmail(chat.users,user)

  return (
    <Container>
        <Header>
          {recipient ? (
            <Avatar src={recipient?.photoURL}/>
          ) : (
            <Avatar>{recipientEmail[0]}</Avatar>
          )}

            <HeaderInformation>
              <h3>{recipientEmail}</h3>
              {recipientSnapshot ? (
                <p>Last active: {``}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo dateTime={recipient?.lastSeen?.toDate()}/>
                ) : "Unavailable"}</p>
              ) : (<p>Loading Last Active ...</p>)}
            </HeaderInformation>
            <HeaderIcons>
              <IconButton>
                <AttachFile/>
              </IconButton>
              <IconButton>
                <MoreVertIcon/>
              </IconButton>
            </HeaderIcons>
        </Header>

        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessageRef}/>
        </MessageContainer>

        <InputContainer>
          <InsertEmoticonIcon/>
          <Input value={input} onChange={e=>setInput(e.target.value)}/>
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
          <MicIcon/>
        </InputContainer>
    </Container>
  )
}

export default ChatScreen

const InputContainer=styled.form`
display:flex;
align-items:center;
padding: 10px;
bottom:0;
background-color:white;
z-index:100;
position:sticky;
`;

const Input=styled.input`
flex:1;
align-items:center;
padding:20px;
border:none;
outline:0;
border-radius:15px;
background-color:whitesmoke;
margin-left:15px;
margin-right:15px;

`;

const MessageContainer=styled.div`
padding:30px;
background-color:#e5ded8;
min-height:90vh;
`;

const EndOfMessage=styled.div`
margin-bottom:50px;
`;

const Container=styled.div``;

const Header=styled.div`
position:sticky;
background-color:white;
z-index:100;
top:0;
display:flex;
padding:11px;
border-bottom:1px solid whitesmoke;
`;

const HeaderInformation=styled.div`
margin-left:15px;
flex:1;

>h3{
  margin-bottom:3px;
}

>p{
  font-size:14px;
  color:gray;
}
`;

const HeaderIcons=styled.div``;
