import {getFirestore, getDocs, query, where, collection, getDoc, doc} from 'firebase/firestore';

export async function getFollows(foreignUserId) {
    let res = {
        followers: undefined,
        following: undefined,
    };
    const firestore = getFirestore();

    //first, get the number of people who follow this user
    try {
        const followsQuery = query(collection(firestore, 'users'), where('following', 'array-contains', foreignUserId));
        const docs = await getDocs(followsQuery);
        let length = 0;
        docs.forEach(() => {
            length++
        });
        res.followers = length;
    }
    catch {
        res.followers = 0;
    };

    //then, get the number of people who this user follows
    try {
        const userDoc = await getDoc(doc(firestore, 'users', foreignUserId));
        res.following = userDoc.data().following.length;
    } 
    catch {
        res.following = 0;
    };

    return res;
};