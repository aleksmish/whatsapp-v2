import { Avatar,IconButton, Button} from '@material-ui/core';
import styled from 'styled-components'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from 'email-validator'
import {auth, db} from '../firebase'
import { collection,addDoc,doc,query, where} from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
import Chat from './Chat'
import {useRouter} from 'next/router'

function Sidebar() {

const [user] = useAuthState(auth); 

const userChatRef=collection(db,'chats')
const q=query(userChatRef, where('users','array-contains',user.email))
const [chatsSnapshot] = useCollection(q);

// Check if recipent email already exists in chat collection
const chatAlreadyExists = (recipentEmail) => 
    chatsSnapshot?.docs.find(chat=>
        chat.data().users.find(user=>user===recipentEmail)?.length>0);

const createChat=()=>{
    const input = prompt(`Please enter an email address for the user you wish to chat with`);
    if(!input) return;

    if(EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input) ){
        // add data to db
       addDoc(collection(db,'chats'),{
            users:[user.email,input]
       }).catch(err=>console.log(err));
    }

};

  return (
    <Container>
        <Header>
            <UserAvatar src={user.photoURL} onClick={()=>auth.signOut()}/>

            <IconsContainer>
                <IconButton>
                    <ChatIcon/>
                </IconButton>

                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </IconsContainer>
        </Header>

        <Search>
            <SearchIcon/>
            <SearchInput placeholder="Chats"/> 
        </Search>     

        <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>  

        {chatsSnapshot?.docs.map(chat=>{
           return <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
        })}
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
flex:0,45;
border-right:1px solid whitesmoke;
height:100vh;
min-width:300px;
max-width:350px;

::-webkit-scrollbar{
    display:none;
}

-ms-overflow-style:none;
scrollbar-width:none;
`;

const SearchInput=styled.input`
outline-width:0;
border:none;
flex:1;
`;

const SidebarButton=styled(Button)`
width:100%;

&&& {
    border-top:1px solid whitesmoke;
    border-bottom:1px solid whitesmoke;
}
`;

const Search=styled.div`
display:flex;
align-items:center;
padding:20px;
border-radius:2px;
`;

const Header = styled.div`
display:flex;
position:sticky;
top:0;
background-color:white;  
z-index:1;
justify-content:space-between;
align-items:center;
padding:15;
height:80px;
border-bottom: 1px solid whitesmoke;
`

const UserAvatar=styled(Avatar)`
cursor: pointer;
margin-left:15px;
:hover {
    opacity:0.8;
}
`;

const IconsContainer=styled.div``;