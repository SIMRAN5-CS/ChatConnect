import EmojiPicker from "emoji-picker-react"
import { arrayUnion, collectionGroup, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"
import { db, storage } from "../lib/firebase";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const Chats = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [chat, setChat] = useState();
    const [image, setImage] = useState({
        file: null,
        url: ""
    })
    const endRef = useRef(null)
    const {chatId,user, isCurrentUserBlocked, isReceiverBlocked,changeBlock} = useSelector(state=>state.chat)
    const { currentUser } = useSelector((state) => {
        // console.log("state.chat", state.chat)
        return state.user
    })
    // console.log("chatid in chats",chatId)
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])
    const [status, setStatus] = useState({ online: false, lastSeen: null });
//last seen
  useEffect(() => {
    const userStatusDocRef = doc(db, 'status', user.id);

    const unsubscribe = onSnapshot(userStatusDocRef, (doc) => {
      if (doc.exists()) {
        setStatus(doc.data());
      }
    });

    return () => unsubscribe();
  }, [user.id]);
    //for realtime message chng in db
    useEffect(() => {
        //here is the problem
        if (chatId) {
            const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
                setChat(res.data())
            })

            return () => {
                unSub()
            }
        }
    }, [chatId])
    // console.log(chat)
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji)
        // console.log(e);
        setOpen(false);
    }
    const handleSend = async () => {
        if (text === "" && !image.file) return
        let imgUrl = null
        console.log("image file exits ", image.file)
        try {
            if (image.file) {
                try {
                    const imgRef = ref(storage, `images/${new Date().getTime()}_${image.file.name}`);
                    const metadata = {
                        contentType: image.file.type
                    };
                    await uploadBytes(imgRef, image.file, metadata);
                    imgUrl = await getDownloadURL(imgRef);
                    console.log("img added to firestore")
                } catch (err) {
                    console.log("Error uploading image:", err);
                }
            }
            try {

                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        senderId: currentUser.id,
                        text,
                        createdAt: new Date(),
                        ...(imgUrl && { img: imgUrl })

                    })
                })
            }
            catch (err) {
                console.log("err in upoading img", err)
            }
            const userIDs = [currentUser.id, user.id]
            userIDs.forEach(async (id) => {
                const userChatRef = doc(db, "userChats", id)
                const userChatSnapshot = await getDoc(userChatRef)

                if (userChatSnapshot.exists()) {
                    const userChatData = userChatSnapshot.data()
                    const chatIndex = userChatData.chats.findIndex(c => c.chatId === chatId)
                     if(chatIndex!==-1){
                        userChatData.chats[chatIndex].lastMessage = text
                        userChatData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
                        userChatData.chats[chatIndex].updatedAt = Date.now()
    
                        await updateDoc(userChatRef, {
                            chats: userChatData.chats
                        })
                     }
                    
                   

                }

            });
        }
        catch (err) {
            console.log("error in sending th emsg")
        }
        setImage({
            file: null,
            url: ""
        })
        setText("")
    }
    const handleImg = (e) => {
        if (e.target.files[0]) {
            console.log(e.target.files[0])
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
            console.log("img is being set")
        }
        console.log("img in hamdle img ", image)
    }

    // console.log(text)
    return (
        <div className=" flex flex-col border-r-2 border-l-2   border-l-gray-800  border-r-gray-800 flex-2 ">
            <div className="top p-5 flex justify-between items-center border-b-gray-800 border-b-2">
                <div className="user flex items-center gap-5 ">
                    <img className="w-[60px] h-[60px] object-cover rounded-full " src={user?.avatar|| "avatar.png"} alt=""></img>
                    <div className="texts flex flex-col">
                        <span className="text-lg font-bold">{user?.name} </span>
                        {/* <p className="text-gray-800 text-sm font-normal">Loremnreihgiuer</p> */}
                        <div>
      {status.online ? (
        <p>Status: Online</p>
      ) : (
        <p>Last seen: {status.lastSeen ? status.lastSeen.toDate().toLocaleString() : "N/A"}</p>
      )}
    </div>
                    </div>
                </div>
                {/* <div className="icons  flex gap-4 items-center ">
                    <img className="w-5 h-5" src="phone.png" alt=""></img>
                    <img className="w-5 h-5" src="video.png" alt=""></img>
                    <img className="w-5 h-5" src="info.png" alt=""></img>
                </div> */}

            </div>
            <div className="center flex-1  p-5 overflow-scroll flex flex-col gap-5">
                {chat?.messages?.map((message) => {
                    return (

                        <div className={`own w-max flex   msg  ${message.senderId===currentUser.id ?"self-end":"self-start"}`}  key={message?.createdAt}>
                            <div className="text flex flex-col gap-1 flex-grow ">
                                {
                                        message.img && <img className=" w-[180px] h-[200px] object-cover rounded-xl " src={message.img} alt=""></img>
                                    }
                                <p className="rounded-xl bg-blue-600 p-5">{message.text}</p>
                                {/* <span className="text-lg">{}</span> */}
                            </div>
                        </div>


                    )
                })}
                { image.url && <div className="ownmsg self-end ">
                    <div className="text">
                        <img src={image.url} className="w-[180px] h-[200px] object-cover rounded-xl" alt=""></img>
                    </div>
                </div>}



                <div className=" " ref={endRef}></div>
            </div>
            <div className="bottom  mt-auto o p-5 flex  gap-5 items-center justify-between border-t-2 border-t-gray-800">
                <div className="icons flex gap-5 ">
                    <label htmlFor="file">
                        <img className="w-5 h-5 cursor-pointer " src="img.png" alt=""></img>
                        
                    </label>
                    <input type="file" className="hidden  disabled:bg-gray-600 disabled:cursor-not-allowed" id="file" onChange={handleImg} disabled={isCurrentUserBlocked||isReceiverBlocked}></input>
                    
                </div>
                <input className="py-2 px-4 rounded-lg text-lg flex-grow bg-gray-700 text-white border-none outline-none  disabled:bg-gray-600 disabled:cursor-not-allowed"  disabled={isCurrentUserBlocked||isReceiverBlocked} type="text" placeholder={isCurrentUserBlocked||isReceiverBlocked?"you cant send a msg":"Type a msg..."} onChange={(e) => setText(e.target.value)}
                    value={text}
                ></input>
                <div className="emoji relative ">
                    <img className="w-5 h-5 cursor-pointer " src="emoji.png" alt="" onClick={() => { setOpen(prev => !prev) }}></img>
                    <div className="picker absolute left-0 bottom-[50px] ">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="send  bg-blue-950 px-2 py-2 border-none cursor-pointer text-white rounded-2xl disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={isCurrentUserBlocked||isReceiverBlocked} onClick={handleSend}>Send</button>

            </div>
        </div>
    )
}
export default Chats