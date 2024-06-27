import {getFirestore, query, collection, where, documentId, getDocs} from 'firebase/firestore';

export async function getUserProfilePicture(auth) {

    const firestore = getFirestore();
    const uid = auth.uid;
    const userFileQuery = query(collection(firestore, 'users'), where(documentId(), '==', uid));
    const userFileSnap = await getDocs(userFileQuery);

    let res = {};
    userFileSnap.forEach((user) => {
        res = user.data();
    });

    return res.profilePictureURL
};