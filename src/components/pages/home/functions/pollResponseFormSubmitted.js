import {getFirestore, updateDoc, doc, getDoc, arrayUnion} from 'firebase/firestore';
import { today } from '../../../../index.js';

export async function pollResponseFormSubmitted(event, options, auth) {
    event.preventDefault();
    const firestore = getFirestore();

    //work out which array index the user voted for
    const index = options.indexOf(event.currentTarget.pollResponse.value);

    //get the votes from firestore
    try {
        const todayDay = today().day;
        const pollDocRef = doc(firestore, 'polls', String(todayDay));
        const pollDoc = await getDoc(pollDocRef);
        let newVotes = pollDoc.data().votes;
        newVotes[index]++;
        await updateDoc(pollDocRef, {
            votes: newVotes,
            voters: arrayUnion(auth.uid),
        });
    }
    catch(error) {
        throw(error);
    };
};