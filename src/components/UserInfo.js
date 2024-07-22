import { useEffect, useState,useRef } from "react"
import { useSelector } from "react-redux"
import { auth, db } from "../lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";


const UserInfo = () => {
    const [open, setOpen] = useState(false)
    const currentUser = useSelector((state) => {
        return state.user.currentUser
    })
    const menuRef=useRef()
    const imgRef=useRef()
    window.addEventListener("click",(e)=>{
        if(e.target !== menuRef.current && e.target !== imgRef.current){
            setOpen(false)
        }

    })
    const handleLogout=async()=>{
            try {
             
          
              if (currentUser) {
                const userStatusDocRef = doc(db, 'status',currentUser.id);
          
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
          
    }
    
    // console.log("currentuseravatar",currentUser.avatar)
    // console.log("currentuser",currentUser)
    return (<div className=" p-5 flex items-center justify-between gap-5">

        <div className=" userinfo flex gap-5 items-center">
            <img className="w-[50px] h-[50px] rounded-full object-cover" src={currentUser?.avatar || "avatar.png"} alt=" avatar" />
            <h2 className="text-2xl font-semibold text-black">{currentUser?.name}</h2>
        </div>
        {/* <div className="  icons  flex gap-5 justify-center items-center ">
             
            <div className=" cursor-pointer bg-gray-200">
                <button ref={imgRef} className="w-[0px] h-[20px]" alt="more" src="more.png" onClick={()=>{setOpen(!open)}}>Logout</button>
               {open&& <div ref={menuRef} className="absolute bg-gray-400 z-10">
                    <ul className="flex flex-col gap-2">
                        <li className="p-2 hover:bg-slate-800 cursor-pointer">profile</li>
                        <li className="p-2 hover:bg-slate-800 cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
               }
            </div> 
           
        </div> */}
        <button className="bg-gray-500 border-2 text-xl p-3 rounded-xl border-gray-500 font-semibold hover:bg-gray-700 " onClick={handleLogout}>LogOut</button>
    </div>

    )
}
export default UserInfo