import {getAuth, signOut} from 'firebase/auth';

export function signUserOut() {
    const auth = getAuth();
    signOut(auth)
    .then(() => {
        return false;
    })
    .catch((error) => {
        throw(error);
    });
};