import { useAuth } from "../../context/authContext.jsx";
import { getAuth } from "firebase/auth";

export default function AuthListener() {
    const {auth, updateAuth} = useAuth();

    //listener for auth changes
    getAuth().onAuthStateChanged((user) => {
        updateAuth(user);
    });
};