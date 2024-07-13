
import './App.css';
import List from './components/List';
import Chats from './components/Chats';
import Details from './components/Details';
import Login from './components/Login';
import Notification from './components/Notification';
import { useEffect } from 'react';
// import User from "./slices/User"
import { useSelector } from 'react-redux';
import { fetchUser } from './slices/UserSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useDispatch } from 'react-redux';



function App() {
  const dispatch = useDispatch()
  const { currentUser, isLoading } = useSelector((state) => {
    return state.user
  })
  const {chatId} =useSelector((state)=>{
    return state.chat
 })
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log("user in useeffecct", user)
      // dispatch(fetchUser(user?.uid))
      if (user) {
        dispatch(fetchUser(user.uid));
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

        {!currentUser ?
          (<Login />) : (<>

            <List />
             <Chats />
            <Details />
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
