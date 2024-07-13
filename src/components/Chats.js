import EmojiPicker from "emoji-picker-react"
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
const Chats = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [chat,setChat] = useState();
     const endRef= useRef(null)
     const {chatId} =useSelector((state)=>{
        console.log("state.chat",state.chat)
        return state.chat
     })
    console.log("chatid in chats",chatId)
     useEffect(()=>{ 
        endRef.current?.scrollIntoView({behavior:"smooth"})
     },[])
     //for realtime message chng in db
     useEffect(()=>{
        //here is the problem
        const unSub = onSnapshot(doc(db,"chats",chatId),(res)=>{
            setChat(res.data())
        })
        return ()=>{
            unSub() 
        }
     },[])
     console.log(chat)
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji)
        console.log(e);
        setOpen(false);
    }

    // console.log(text)
    return (
        <div className=" flex flex-col border-r-2 border-l-2   border-l-gray-800  border-r-gray-800 basis-1/2 ">
            <div className="top p-5 flex justify-between items-center border-b-gray-800 border-b-2">
                <div className="user flex items-center gap-5 ">
                    <img className="w-[60px] h-[60px] object-cover rounded-full " src="avatar.png" alt=""></img>
                    <div className="texts flex flex-col">
                        <span className="text-lg font-bold">Jane Doe </span>
                        <p className="text-gray-800 text-sm font-normal">Loremnreihgiuer</p>
                    </div>
                </div>
                <div className="icons  flex gap-4 items-center ">
                    <img className="w-5 h-5" src="phone.png" alt=""></img>
                    <img className="w-5 h-5" src="video.png" alt=""></img>
                    <img className="w-5 h-5" src="info.png" alt=""></img>
                </div>

            </div>
            <div className="center flex-1  p-5 overflow-scroll flex flex-col gap-5">
                <div className="msg w-[70%] flex gap-5  ">
                    <img className="w-8 h-8 rounded-full object-cover" src="avatar.png" alt=""></img>
                    <div className="text flex flex-col gap-1 flex-grow">
                        <p className="bg-blue-600 p-5 rounded-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum</p>
                        <span className="text-lg">Date 1min ago</span>
                    </div>
                </div>
                <div className="own w-[70%] flex   msg self-end">
                   
                    <div className="text flex flex-col gap-1 flex-grow ">
                        <p  className="rounded-xl bg-blue-600 p-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum</p>
                        <span className="text-lg">Date 1min ago</span>
                    </div>
                </div>
                <div className="msg w-[70%] flex  gap-5">
                    <img  className="w-8 h-8 rounded-full object-cover" src="avatar.png" alt=""></img>
                    <div className="text flex flex-col gap-1 flex-grow">
                        <p className="rounded-xl bg-blue-600 p-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum</p>
                        <span className="text-lg">Date 1min ago</span>
                    </div>
                </div>
                <div className="own msg self-end w-[70%] flex" >
                    
                    <div className="text">
                        <img  className="w-full rounded-xl object-cover h-72 mb-1" src="data:image/jpeg;base64,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" alt=""></img>
                        <p className="rounded-xl bg-blue-600 p-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum</p>
                        <span className="text-lg">Date 1min ago</span>
                    </div>
                </div>
                <div className="msg w-[70%] flex  gap-5">
                    <img className="w-8 h-8 rounded-full object-cover" src="avatar.png" alt=""></img>
                    <div className="text flex flex-col gap-1 flex-grow">
                        <p className="rounded-xl bg-blue-600 p-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum</p>
                        <span className="text-lg">Date 1min ago</span>
                    </div>
                </div>
                <div className="own msg w-[70%] flex self-end">
                    
                    <div className="text flex flex-col gap-1 flex-grow">
                        <p className="rounded-xl bg-blue-600 p-5 ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum</p>
                        <span className="text-lg">Date 1min ago</span>
                    </div>
                </div>
                <div className=" " ref={endRef}></div>
            </div>
            <div className="bottom  mt-auto o p-5 flex  gap-5 items-center justify-between border-t-2 border-t-gray-800">
                <div className="icons flex gap-5 ">
                    <img className="w-5 h-5 cursor-pointer" src="img.png" alt=""></img>
                    <img className="w-5 h-5 cursor-pointer" src="camera.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="mic.png" alt=""></img>
                </div>
                <input className="py-2 px-4 rounded-lg text-lg flex-grow bg-gray-700 text-white border-none outline-none" type="text" placeholder="Type a message..." onChange={(e) => setText(e.target.value)}
                    value={text}
                ></input>
                <div className="emoji relative ">
                    <img className="w-5 h-5 cursor-pointer " src="emoji.png" alt="" onClick={() => { setOpen(prev => !prev) }}></img>
                    <div className="picker absolute left-0 bottom-[50px] ">
                        <EmojiPicker open={open}  onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="send  bg-blue-950 px-2 py-2 border-none cursor-pointer text-white rounded-2xl">Send</button>

            </div>
        </div>
    )
}
export default Chats