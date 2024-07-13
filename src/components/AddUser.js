import {  arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useState } from "react"
import { useSelector } from "react-redux"
const AddUser = () => {
    const {currentUser}= useSelector((store)=>{
            return  store.user
    })
   const [user, setUser] = useState(null)
   const handleSearch = async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const username = formData.get("username")
      try {
         const userRef = collection(db, "users");

         // Create a query against the collection.
         const q = query(userRef, where("name", "==", username));
         const querySnapshot = await getDocs(q)
         if (!querySnapshot.empty) {
            setUser(querySnapshot.docs[0].data())
            console.log("user in adduser",user)
         }
         else{
            console.log('no data to show')
         }
      } catch (error) {
         console.log(error)
      }

   }
    const handleAdd=async()=>{

      const chatRef= collection(db,"chats")
      const userChatRef= collection(db,"userChats")

      try{
         // Create a new chat document with an auto-generated ID
         const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
         createdAt: serverTimestamp(),
         messages: [],
      });

      // console.log("user.id",user.id)


      
      console.log("Chat created with ID:", newChatRef.id);
      // console.log("currentuser.id",currentUser.id)
      //Updating userchats
      await updateDoc(doc(userChatRef,user.id),{
         chats:arrayUnion({
            chatId:newChatRef.id,
            receiverId:currentUser.id,
            lastMessage:"",
            updatedAt:Date.now()
         })
      })
     
      await updateDoc(doc(userChatRef,currentUser.id),{
         chats:arrayUnion({
            chatId:newChatRef.id,
            receiverId:user.id,
            lastMessage:"",
            updatedAt:Date.now()
         })
      })

      }
      catch(err){
    console.log(err)
      }
    }
   return (<div className="adduser absolute top-0 left-0 bottom-0 right-0 p-7 bg-blue-950 opacity-95 rounded-lg  m-auto w-max h-max">
      <form onSubmit={handleSearch} className="flex gap-5">
         <input className="p-5 rounded-lg border-none outline-none" type="text" name="username" placeholder="Username"></input>
         <button className="bg-slate-700 p-2 rounded-lg text-white cursor-pointer">Search</button>
      </form>
      {user && <div className="user mt-[50px] flex items-center justify-between">
         <div className="detail flex gap-5 items-center">
            <img className="w-[50px] h-[50px] rounded-full object-cover" src={user.avatar||"avatar.png"} alt=""></img>
            <span className="text-white">{user.name}</span>
         </div>
         <button className="bg-slate-700 p-1 rounded-lg text-white cursor-pointer" onClick={handleAdd}>Adduser</button>

      </div>}
      
   </div>)
}
export default AddUser