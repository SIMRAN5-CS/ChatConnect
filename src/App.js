
import './App.css';
import List from './components/List';
import Chats from './components/Chats';
import Details from './components/Details';
import Login from './components/Login';
import Notification from './components/Notification';
import { useEffect, useState } from 'react';
// import User from "./slices/User"
import { useSelector } from 'react-redux';
import { fetchUser } from './slices/UserSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { useDispatch } from 'react-redux';
import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';




function App() {
  const dispatch = useDispatch()
  const [presence, setPresence] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const [logged,setLogged] =useState(false)
  const { currentUser, isLoading } = useSelector((state) => {
    return state.user
  })
  const { chatId } = useSelector((state) => {
    return state.chat
  })
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      // console.log("user in useeffecct", user)
      // dispatch(fetchUser(user?.uid))
      if (user) {
        dispatch(fetchUser(user.uid));
        console.log("userfetched")
      } else {
        // Handle the case where the user is not authenticated
        dispatch(fetchUser(null)); // This will trigger an error in the thunk and set currentUser to null
      }
    })
    //useffect cleanup function remove unsub from stack not compulsory
    return () => {
      unSub();
    }
  }, [dispatch])


  if (isLoading) {
    return (<div className="bg-home-bg  h-screen bg-cover flex items-center justify-center ">
      <div className="h-[90vh] w-[90vw] bg-regal-blue bg-opacity-50 rounded-lg flex  items-center justify-center">loading...</div>
    </div>)
  }
  return (


    <div className="bg-home-bg  h-screen bg-cover flex items-center justify-center ">
      <div className="h-[90vh] w-[90vw] bg-regal-blue bg-opacity-50 rounded-lg flex ">
    
        {currentUser===null ?
          (<Login logged={logged} setLogged={setLogged} />) : (<>

            <List />
            {chatId && <Chats />}
            {chatId && <Details />}
            

          </>)}


      </div>
      <Notification />


    </div>
    // <div>
    //  <User/>

    // </div>

  );
}

export default App;
