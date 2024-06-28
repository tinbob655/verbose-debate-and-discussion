import {getFirestore, setDoc, doc, getDoc} from 'firebase/firestore';
import { changeReputation } from '../../../multi-page/functions/changeReputation.js';

export async function questionResponseFormSubmitted(event, auth) {
    event.preventDefault();

    if (!auth) {
        throw ('Auth was null');
    };

    const firestore = getFirestore();

    //get the user's username
    const userDoc = await getDoc(doc(firestore, 'users', auth.uid));
    const username = userDoc.data().username;
    const post = event.target.yourResponseText.value;

    //before writing to question responses, check if the user has already responded to today's question
    const userQuestionResponse = await getDoc(doc(firestore, 'questionResponses', username));
    const userAlreadyResponded = userQuestionResponse.exists() ? true : false;
    //add to the user's reputation if it was their first time responding to today's question
    if (!userAlreadyResponded) {
        await changeReputation(2, auth.uid).catch((err) => {throw(err)});
    };

    //write the user's post to question responses
    await setDoc(doc(firestore, 'questionResponses', username), {
        post: post,
        voters: [],
        votes: 0,
    });

    window.location.reload();
};