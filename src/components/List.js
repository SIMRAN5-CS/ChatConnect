import ChatList from "./ChatList"
import UserInfo from "./UserInfo"

const List=()=>{
    return(
        <div className="basis-1/4 flex  flex-col">
        <UserInfo/>
        <ChatList/>
        </div>
    )
}
export default List