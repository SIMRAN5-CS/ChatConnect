import { auth } from "../lib/firebase"

const Details = () => {
    return (
        <div className=" basis-1/4">
            <div className="user px-7 py-4 flex flex-col items-center gap-2 border-b-2 border-b-gray-800">
                <img className="h-[100px] w-[100px] object-cover rounded-full" src="avatar.png" alt=""></img>
                <h2 className="">Jane doe</h2>
                <p>bvreoivobwoeb voerhiv obveri</p>
            </div>
            <div className="info p-5 flex flex-col gap-3 ">
                <div className="option ">
                    <div className="title flex justify-between items-center">
                        <span >Chat Settings </span>
                        <img className="cursor-pointer w-7 h-7 p-2 rounded-full bg-gray-600" src="arrowUp.png" alt=""></img>
                    </div>
                </div>
                <div className="option ">
                    <div className="title flex justify-between items-center">
                        <span>Privacy </span>
                        <img className="cursor-pointer w-7 h-7 p-2 rounded-full bg-gray-600" src="arrowUp.png" alt=""></img>
                    </div>
                </div>
                <div className="option ">
                    <div className="title flex justify-between items-center">
                        <span>Privacy </span>
                        <img className="cursor-pointer w-7 h-7 p-2 rounded-full bg-gray-600" src="arrowUp.png" alt=""></img>
                    </div>
                </div>
                <div className="option ">
                    <div className="title flex justify-between items-center ">
                        <span>Shared photos </span>
                        <img className="cursor-pointer w-7 h-7 p-2 rounded-full bg-gray-600"  src="arrowDown.png" alt=""></img>
                    </div>
                    <div className=" mt-3 photos flex flex-col gap-1  ">
                        <div className="photo-item flex justify-between ">
                            <div className="photo-detail flex gap-2 items-center ">
                                <img  className="w-10 h-10 rounded-md" src="img1.jpeg" alt=""></img>
                                <span className="text-sm text-gray-900 font-light">Photoname.png</span>
                            </div>
                            <img className=" w-7 h-7 p-1 bg-slate-800 rounded-full" src="download.png" alt=""></img>
                        </div>
                        <div className="photo-item flex justify-between">
                            <div className="photo-detail flex gap-2 items-center">
                                <img className="w-10 h-10 rounded-md" src="img1.jpeg" alt=""></img>
                                <span className="text-sm text-gray-900 font-light">Photoname.png</span>
                            </div>
                            <img className="w-7 h-7 p-1 bg-slate-800    rounded-full" src="download.png" alt=""></img>
                        </div>
                        <div className="photo-item flex justify-between">
                            <div className="photo-detail flex gap-2 items-center ">
                                <img className="w-10 h-10 rounded-md" src="img1.jpeg" alt=""></img>
                                <span className="text-sm text-gray-900 font-light">Photoname.png</span>
                            </div>
                            <img className="w-7 h-7 p-1 bg-slate-800    rounded-full" src="download.png" alt=""></img>
                        </div>
                        <div className="photo-item flex justify-between">
                            <div className="photo-detail flex gap-2 items-center ">
                                <img className="w-10 h-10 rounded-md" src="img1.jpeg" alt=""></img>
                                <span className="text-sm text-gray-900 font-light">Photoname.png</span>
                            </div>
                            <img className="w-7 h-7 p-1 bg-slate-800    rounded-full" src="download.png" alt=""></img>
                        </div>
                    </div>
                </div>
                <div className="option ">
                    <div className="title  flex justify-between items-center">
                        <span>Shared Files </span>
                        <img className="cursor-pointer w-7 h-7 p-2 rounded-full bg-gray-600" src="arrowUp.png" alt=""></img>
                    </div>
                </div>
                <button className="cursor-pointer p-2 text-white border-none rounded-lg bg-red-400 hover:bg-red-900">Block User</button>
                <button className="p-2 rounded-lg bg-blue-700 cursor-pointer" onClick={()=>{auth?.signOut()}}>LogOut</button>
            </div>
        </div>
    )
}
export default Details