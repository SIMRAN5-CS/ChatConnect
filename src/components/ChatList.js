import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import { useDispatch, useSelector } from "react-redux";
import { getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { doc } from "firebase/firestore";
import { updateChat } from "../slices/ChatSlice";
const ChatList = () => {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([])
    const { currentUser, isLoading } = useSelector((state) => {
        return state.user
    })
    const {chatId} =useSelector((state)=>{
       console.log(state.chat)
        return state.chat
     })
     const dispatch =useDispatch()
     
    
    useEffect(() => {
        console.log("currentuserid in  useeffect",currentUser.id)
        const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async (response) => {
            // console.log("Current data: ", doc.data())
            // setChats( doc.data())
            console.log(response.data())
            const items = response.data()?.chats|| [];
            const promises = items?.map(async (item) => {

                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user =userDocSnap.data()

                return  {...item,user}

            })
             const chatData= await Promise.all(promises)
             setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
             console.log("chats",chats)

        });
        return () => {
            unSub()
        }

    }, [currentUser.id])
    // console.log(chats)
    const handleSelect=async(chat)=>{
        const {chatId,user}=chat
         console.log("chat in hanldeselect",chat)
        console.log("handleselectcalled")
        console.log("chatid of chat in chatlist before updating",chat.chatId)
        dispatch(updateChat({chatId,user}))
        console.log("chatid of chat in chatlist after updating",chat.chatId)
        

    }
    // console.log(chatId)
    return (
        <div className="chatlist box-border  overflow-y-scroll overflow-x-hidden   flex-col">
            <div className="search  flex items-center p-5 gap-5">
                <div className="search-bar  p-2 flex-grow  rounded-lg bg-dark-blue opacity-50 flex  gap-5 items-center">
                    <img className=" w-5 h-5" src="search.png" alt=""></img>
                    <input className="outline-none  text-white border-none flex-grow bg-transparent  " type="text" placeholder="Search"></input>
                </div>
                <img src={addMode ? "minus.png" : "plus.png"}
                    className="w-9 h-9 bg-dark-blue p-2 rounded-md opacity-50 cursor-pointer" alt=""
                    onClick={() => { addMode ? setAddMode(false) : setAddMode(true) }}></img>
                {/* { onClick={() => setAddMode(prevMode => !prevMode)} } */}

            </div>
            {chats?.map((chat) => {
                {console.log(chat)}
                return (<div key={chat.chatId} className="item p-5 flex gap-5  cursor-pointer border-b-2 border-gray-800" onClick={()=>{handleSelect(chat)}}>
                    <img className="w-[50px] h-[50px] rounded-full object-cover" src={chat.user.avatar||"avatar.png"} alt=""></img>
                    <div className="texts">
                        <span className="font-medium">{chat.user.username}</span>
                        <p className="text-sm font-light">{chat.lastMessage}</p>
                    </div>
                </div>)
            })}

            {addMode && <AddUser />}

        </div>
    )
}
export default ChatList
