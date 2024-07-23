import { useSelector, useDispatch } from "react-redux"
import { auth, db } from "../lib/firebase"
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, onSnapshot, getDoc } from "firebase/firestore"
import { changeBlock } from "../slices/ChatSlice"
import { serverTimestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { updateChatList,setChatId } from "../slices/ChatSlice"


const Details = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useSelector(state => state.chat)
    const { currentUser } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const handleBlock = async () => {
        if (!user) return
        const userDocRef = doc(db, "users", currentUser.id)
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
            })
            dispatch(changeBlock())


        }
        catch (error) {
            console.log(error)

        }

    }
    const handleLogout = async () => {
        try {


            if (currentUser) {
                const userStatusDocRef = doc(db, 'status', currentUser.id);

                // Update status to offline and set last seen timestamp
                await setDoc(userStatusDocRef, {
                    online: false,
                    lastSeen: serverTimestamp()
                }, { merge: true });

                await auth?.signOut();

                // Optional: Navigate to login page or other post-logout logic
            }
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };
    const [open, setOpen] = useState(true)
    const [status, setStatus] = useState({ online: false, lastSeen: null });
    const [messages, setMessages] = useState([]);

    //last seen
    useEffect(() => {
        const userStatusDocRef = doc(db, 'status', user.id);
        const unsubscribe = onSnapshot(userStatusDocRef, (doc) => {
            if (doc.exists()) {
                setStatus(doc.data());
            }
        });
        return () => {
            unsubscribe()
        }

    }, [user.id])
    useEffect(() => {
        if (!chatId) return;

        const chatsRef = doc(db, "chats", chatId);

        const unsubscribe = onSnapshot(chatsRef, (chatSnapshot) => {
            if (chatSnapshot.exists()) {
                const chatData = chatSnapshot.data();
                const filteredMessages = chatData.messages.filter(message => message.img);
                setMessages(filteredMessages || []);
            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching chat data: ", error);
        });

        return () => unsubscribe(); // Clean up subscription on unmount
    }, [chatId]);
    const handleImgClick = (imgUrl) => {
        window.open(imgUrl)

    }
    const handleDelete = async () => {
        try {
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, {
                messages: []
            });
             // Remove chat from userChats document
        const userChatRef = doc(db, "userChats", currentUser.id);
        const userChatSnap = await getDoc(userChatRef);
        if (userChatSnap.exists()) {
            const userChatData = userChatSnap.data();
            const updatedChats = userChatData.chats.filter(chat => chat.chatId !== chatId);
            await updateDoc(userChatRef, {
                chats: updatedChats
            });
        }
        dispatch(updateChatList(chatId)); // Create and import updateChatList action in your slice
        dispatch(setChatId(null)); // Upd
            setMessages([]); // Update local state to reflect changes
            console.log("Messages deleted successfully");
        } catch (error) {
            console.error("Error deleting messages: ", error);
        }
    }


    return (
        <div className="  hidden lg:flex flex-1   flex-col overflow-y-scroll gap-2  ">
            <div className="user px-7 py-4 flex flex-col items-center gap-2 border-b-2 border-b-gray-800">
                <img className="h-[100px] w-[100px] object-cover rounded-full" src={user?.avatar || "avatar.png"} alt=""></img>
                <h2 className="">{user?.name}</h2>
                {status.online ? (
                    <p>Status: Online</p>
                ) : (
                    <p>Last seen: {status.lastSeen ? status.lastSeen.toDate().toLocaleString() : "N/A"}</p>
                )}
            </div>
            <div className="info p-5 flex flex-col gap-3 ">
                <div className="option ">
                    <div className="title flex justify-between items-center">
                        <span className="text-xl font-normal" >Delete Chat </span>
                        <button className="cursor-pointer p-2 rounded-full text-xl bg-gray-500" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
                <div className="option ">
                    <div className="title flex justify-between items-center ">
                        <span className="text-xl font-normal">Shared photos </span>

                        <img className="cursor-pointer text-xl w-7 h-7 p-2 rounded-full bg-gray-500" src="arrowDown.png" alt="" onClick={() => { setOpen(prev => !prev) }}></img>
                    </div>
                    {console.log(open)}
                    { open &&(
                        messages.length === 0 ? (
                            <div className="flex justify-center">
                                <p>No Shared Photos</p>
                            </div>
                        ) : (
                            <div className="mt-3 photos flex flex-wrap  gap-3">
                                {messages.map((message, index) => (
                                    <div key={index} className="photo-item">
                                        <img
                                            className="w-20 h-20 rounded-md cursor-pointer hover:scale-110"
                                            src={message.img}
                                            alt=""
                                            onClick={() => handleImgClick(message.img)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                    
                </div>
            </div>
            <div className=" flex flex-col items-center gap-3">
                <button className=" w-[90%] cursor-pointer p-2  text-white border-none rounded-lg bg-red-400 hover:bg-red-900" onClick={handleBlock}>{isCurrentUserBlocked ? "You are blocked " : isReceiverBlocked ? "User blocked " : "Block User"}</button>
                <button className=" w-[90%] p-2 rounded-lg bg-blue-700 cursor-pointer hover:bg-blue-900" onClick={handleLogout}>LogOut</button>
            </div>
        </div>
    )
}
export default Details