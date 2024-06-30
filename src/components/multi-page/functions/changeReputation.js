import {getFirestore, updateDoc, increment, doc} from 'firebase/firestore';

export async function changeReputation(ammount, uid) {

    //only allow ammounts which are in respected bounts
    const bound = 5;
    if (ammount < bound && ammount > 0 - bound) {
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', uid);
    
        await updateDoc(userDocRef, {
            reputation: increment(1),
        });
    }
    else throw(`Can only change reputation by a value of +-${bound}`);
};