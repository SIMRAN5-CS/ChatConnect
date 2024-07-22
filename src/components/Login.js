import { useEffect, useState } from "react"
import { toast } from "react-toastify"
// import { auth } from "../lib/firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"

import { auth, db, storage, database } from "../lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { serverTimestamp } from "firebase/firestore"
import { useSelector } from "react-redux"




const Login = (props) => {
    console.log(props)
    const { logged, setLogged } = props
    const { currentUser } = useSelector((store) => {

        return store.user

    })
    console.log(currentUser)

    const [avatar, setAvatar] = useState({
        file: null,
        url: ""

    })
    const [loading, setLoading] = useState(false);
    const handleAvatar = (e) => {

        if (e.target.files[0]) {
            console.log(e.target.files[0])
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }


    }

    // console.log("avatar in login", avatar)
    const handleLogin = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const email = formData.get("email")
        const password = formData.get("password")
        setLoading(true)

        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            toast.success("loggedin succesfully")
            setLogged(true)
            const userStatusDocRef = doc(db, 'status', response.user.uid);

            // Update status to online and set last seen timestamp
            await setDoc(userStatusDocRef, {
                online: true,
                lastSeen: serverTimestamp()
            }, { merge: true });

        }
        catch (err) {
            console.log(err)
            toast.error(err.message)
        }
        finally {
            setLoading(false)
        }


    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        //formdata repsresnts form and every input can be referenced by using name of that input
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email")
        let downloadURL = '';

        try {
            //authentication and create user with email and paswrd
            const response = await createUserWithEmailAndPassword(auth, email, password)
            // console.log(response)
            // Reference to the user's status document
            const userStatusDocRef = doc(db, 'status', response.user.uid);

            // Update status to online and set last seen timestamp
            await setDoc(userStatusDocRef, {
                online: true,
                lastSeen: serverTimestamp()
            }, { merge: true });


            toast.success("acct created,please login to continue")

            //put img in firestore
            if (avatar.file) {
                try {
                    const imgRef = ref(storage, `images/${new Date().getTime()}_${avatar.file.name}`);
                    const metadata = {
                        contentType: avatar.file.type
                    };
                    // console.log("Uploading file:", avatar.file);
                    await uploadBytes(imgRef, avatar.file, metadata);
                    downloadURL = await getDownloadURL(imgRef);
                    // console.log("Download URL:", downloadURL);
                    toast.success("File uploaded successfully");
                } catch (uploadError) {
                    // console.error("Upload error:", uploadError);
                    toast.error("Error uploading file");
                }
            }
            //adding to db
            await setDoc(doc(db, "users", response.user.uid), {
                avatar: downloadURL,
                name: username,
                password: password,
                email: email,
                blocked: [],
                id: response.user.uid

            });
            // console.log("users created")
            await setDoc(doc(db, "userChats", response.user.uid), {
                id: response.user.uid,
                chats: []
            });
        }
        catch (err) {
            const getFirebaseErrorMessage = (errorCode) => {
                switch (errorCode) {
                    case 'auth/weak-password':
                        return 'Password should be at least 6 characters.';
                    case 'auth/email-already-in-use':
                        return 'Email already in use,Plase Login.';
                    case 'auth/invalid-email':
                        return 'Invalid email address.';
                    case 'auth/user-not-found':
                        return 'User not found.';
                    case 'auth/wrong-password':
                        return 'Wrong password.';
                    default:
                        return 'An unknown error occurred.';
                }
            };
            console.log("some error occured", err)
            toast.error(getFirebaseErrorMessage(err.code))
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <div className="w-full h-full flex items-center gap-[100px]  ">
            <div className="Login basis-1/2 flex flex-col items-center gap-5">
                <h2 className="text-2xl font-medium">Welcome Back</h2>
                <form className="flex flex-col gap-5 items-center" onSubmit={handleLogin}>
                    <input className="p-5 border-none outline-none bg-slate-700 text-white rounded-md" type="text " placeholder="Email" name="email"></input>
                    <input className="p-5 border-none outline-none bg-slate-700 text-white rounded-md" type="text " placeholder="Password" name="password"></input>
                    <button disabled={loading} className="w-full border-none bg-blue-600 rounded-lg p-5 text-white cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-slate-700">{loading ? "loading" : "Login"}</button>
                </form>
            </div>
            <div className="separator h-[80%] w-1 bg-gray-800"></div>
            <div className="Register basis-1/2 flex flex-col items-center gap-5">
                <h2 className="text-2xl font-medium">Create Account</h2>
                <form onSubmit={handleRegister} className="flex flex-col gap-5 items-center">
                    {/* IMP */}
                    {/* {console.log(avatar.url || "avatar.png")} */}
                    <label className="underline cursor-pointer w-full flex items-center justify-between" htmlFor="file1">Upload an IMage
                        <img className="w-[50px] h-[50px] rounded-full object-cover opacity-[0.6]" src={avatar.url || "avatar.png"} alt=""></img>
                    </label>
                    <input type="file" id="file1" multiple className="hidden" onChange={handleAvatar}></input>

                    <input className="p-5 border-none outline-none bg-slate-700 text-white rounded-md" type="text " placeholder="UserName" name="username"></input>
                    <input className="p-5 border-none outline-none bg-slate-700 text-white rounded-md" type="text " placeholder="Email" name="email"></input>
                    <input className="p-5 border-none outline-none bg-slate-700 text-white rounded-md" type="text " placeholder="Password" name="password"></input>
                    <button disabled={loading} type="submit" className="w-full border-none bg-blue-600 rounded-lg p-5 text-white cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-slate-700">{loading ? "loading" : "SignUp"}</button>
                </form>
            </div>
        </div>
    )
}
export default Login