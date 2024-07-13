import React, { useDebugValue } from 'react'
import store from '../app/store'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from './UserSlice'
const User = () => {
    const userdata =useSelector((state)=>{
     
         return state.user.user
    })
    console.log("userdata",userdata)
  
    const dispatch =useDispatch();
    const uid="rKDOIgrpQxRfGverSz4m2I8fdff1"
  return (
    <div>
       <h2>userdata</h2>
       <button onClick={()=>{dispatch(fetchUser(uid))}}>fetch data</button>
    </div>
  )
}

export default User
