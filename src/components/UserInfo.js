import { useSelector } from "react-redux"

const UserInfo = () => {
    const currentUser=useSelector((state)=>{
        return state.user.currentUser
    })
    // console.log("currentuseravatar",currentUser.avatar)
    console.log("currentuser",currentUser)
    return (<div className=" p-5 flex items-center justify-between gap-5">

        <div className=" userinfo flex gap-5 items-center">
            <img className="w-[50px] h-[50px] rounded-full object-cover" src={currentUser?.avatar||"avatar.png"} alt=" avatar" />
            <h2 className="text-2xl font-semibold text-black">{currentUser?.name}</h2>
        </div>
        <div className=" icons  flex gap-5 justify-center items-center ">
            <img className="w-[20px] h-[20px] " src="more.png" alt="more" />
            <img className="w-[20px] h-[20px]" src="video.png" alt="video" />
            <img className="w-[20px] h-[20px]" src="edit.png" alt="edit" />
        </div>
    </div>

    )
}
export default UserInfo