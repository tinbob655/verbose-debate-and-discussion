import {getFirestore, updateDoc, doc, getDoc, arrayUnion} from 'firebase/firestore';
import { today } from '../../../../index.js';
import { changeReputation } from '../../../multi-page/functions/changeReputation.js';

export async function pollResponseFormSubmitted(event, options, auth) {
    event.preventDefault();
    const firestore = getFirestore();

    //work out which array index the user voted for
    const index = options.indexOf(event.currentTarget.pollResponse.value);

    try {
        const todayDay = today().day;
        const pollDocRef = doc(firestore, 'polls', String(todayDay));

        //get the votes from firestore
        const pollDoc = await getDoc(pollDocRef);
        let newVotes = pollDoc.data().votes;
        newVotes[index]++;

        //write the new votes to firestore
        await updateDoc(pollDocRef, {
            votes: newVotes,
            voters: arrayUnion(auth.uid),
        });

        //add one to the users reputation
        await changeReputation(1, auth.uid);
    }
    catch(error) {
        throw(error);
    };
};