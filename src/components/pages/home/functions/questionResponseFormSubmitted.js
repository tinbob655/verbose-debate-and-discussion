import {getFirestore, query, collection, where, documentId, getDocs, setDoc, doc} from 'firebase/firestore';

export async function questionResponseFormSubmitted(event, auth) {
    event.preventDefault();

    if (!auth) {
        throw ('Auth was null');
    };

    const post = event.currentTarget.yourResponseText.value;
    const firestore = getFirestore();
    
    //fetch the username from firestore
    const usernameQuery = query(collection(firestore, 'users'), where(documentId(), '==', auth.uid));
    getDocs(usernameQuery)
    .then((docs) => {
        docs.forEach((document) => {

            const username = document.data().username;

            setDoc(doc(firestore, 'questionResponses', username), {
                post: post,
                voters: [],
                votes: 0,
            })
            .then(() => {
                window.location.reload();
            });
        });
    });
};