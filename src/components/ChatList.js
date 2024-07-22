import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import { useDispatch, useSelector } from "react-redux";
import { getDoc, onSnapshot, updateDoc ,serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { doc } from "firebase/firestore";
import { updateChat } from "../slices/ChatSlice";
import { updateChatList } from "../slices/ChatSlice";
const ChatList = () => {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([])
    const [input,setInput]= useState("")
    const { currentUser, isLoading } = useSelector((state) => {
        return state.user
    })
    const {chatId} =useSelector((state)=>{
        return state.chat
    })
    console.log("chatid of particular chat",chatId)
     const dispatch =useDispatch()
     
    
    useEffect(() => {
        // console.log("currentuserid in  useeffect",currentUser.id)
        const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async (response) => {
            // console.log("Current data: ", doc.data())
            // setChats( doc.data())
            // console.log(response.data())
            const items = response.data()?.chats|| [];
            const promises = items?.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);

            //   onSnapshot(userDocRef,async (userdata)=>{
            //      if(userdata.exists()){
            //         const user =userdata.data()
            //     console.log("user",user)
            //      console.log(item)
            //     return {...item,user}
            //      }
                
            //    })
                
                const userDocSnap = await getDoc(userDocRef);
                const user =userDocSnap.data()
                // console.log("user in chatlist",user)

                return  {...item,user}

            })
             const chatData= await Promise.all(promises)
             //chatdata is {user:} in which useer is recevier id 
             
             setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
            //  console.log("chats1",chats)
             
            

        });
        return () => {
            unSub()
        }

    }, [currentUser.id])
    // console.log("chats of chatlist",chats)
    useEffect(() => {
        const unsubscribe = dispatch(updateChatList(chatId));
        // return () => {
        //     unsubscribe();
        // };
    }, [chatId, dispatch]);



    
    const handleSelect=async(chat)=>{
        const userChats =chats.map(item=>{
            const {user,...rest}= item
            return rest
        })
        // console.log("userchats",userChats)
        const  chatIndex= userChats.findIndex(item=>item.chatId ===chat.chatId)
        // console.log("chatIndex",chatIndex)
        userChats[chatIndex].isSeen=true
        
        const userChatRef= doc(db,"userChats",currentUser.id)
        try{
            await updateDoc(userChatRef,{
                chats:userChats
            })
            const {chatId,user}=chat
            dispatch(updateChat({chatId,user}))
        }
        catch(error){
            console.log(error)
        }
    }
    console.log(chatId)
    console.log("chats",chats)
    const filteredChats= chats.filter(c=>c?.user?.name.toLowerCase().includes(input.toLowerCase()))
    return (
        <div className="chatlist box-border  overflow-y-scroll overflow-x-hidden  flex-col">
            <div className="search  flex items-center p-5 gap-5">
                <div className="search-bar  p-2 flex-grow  rounded-lg bg-dark-blue opacity-50 flex  gap-5 items-center">
                    <img className=" w-5 h-5" src="search.png" alt=""></img>
                    <input className="outline-none  text-white border-none flex-grow bg-transparent  " type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}></input>
                </div>
                <img src={addMode ? "minus.png" : "plus.png"}
                    className="w-9 h-9 bg-dark-blue p-2 rounded-md opacity-50 cursor-pointer" alt=""
                    onClick={() => { addMode ? setAddMode(false) : setAddMode(true) }}></img>
                {/* { onClick={() => setAddMode(prevMode => !prevMode)} } */}

            </div>
            {filteredChats?.map((chat) => {
                
                return (<div key={chat.chatId} className={`item p-5 flex gap-5  cursor-pointer border-b-2 border-gray-800 ${chat?.isSeen?"": "bg-blue-700"}`} onClick={()=>{handleSelect(chat)}}>
                    <img className="w-[50px] h-[50px] rounded-full object-cover" src={chat.user.blocked.includes(currentUser.id)?"avatar.png":chat.user.avatar||"avatar.png"} alt=""></img>
                    <div className="texts">
                        <span className="font-medium">{chat.user.blocked.includes(currentUser.id)?"User":chat.user.name}</span>
                        <p className="text-sm font-light">{chat.lastMessage}</p>
                    </div>
                </div>)
            })}

            {addMode && <AddUser  addMode={addMode} setAddMode={setAddMode}/>}

        </div>
    )
}
export default ChatList
