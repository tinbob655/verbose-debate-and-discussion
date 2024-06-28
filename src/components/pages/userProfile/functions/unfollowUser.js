import {getFirestore, updateDoc, arrayRemove, doc} from 'firebase/firestore';

export async function unfollowUser(localUserId, foreignUserId) {
    const firestore = getFirestore();
    await updateDoc(doc(firestore, 'users', localUserId), {
        following: arrayRemove(foreignUserId),
    });

    return false;
};