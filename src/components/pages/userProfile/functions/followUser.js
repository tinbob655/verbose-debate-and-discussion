import {getFirestore, arrayUnion, doc, updateDoc} from 'firebase/firestore';

export async function followUser(localUserId, foreignUserId) {
    const firestore = getFirestore();

    //add the foreign user to the local user's following array
    const localUserDocRef = doc(firestore, 'users', localUserId);
    await updateDoc(localUserDocRef, {
        following: arrayUnion(foreignUserId),
    });

    return true;
};