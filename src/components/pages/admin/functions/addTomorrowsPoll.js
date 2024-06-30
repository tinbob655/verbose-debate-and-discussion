import {getFirestore, setDoc, doc} from 'firebase/firestore';

export async function addTomorrowsPoll(event, uid) {
    event.preventDefault();

    if (uid !== process.env.REACT_APP_ADMIN_UID) {
        throw('Invalid user');
    };

    const question = event.currentTarget.question.value;
    const options = event.currentTarget.options.value;

    if (!question || !options) {
        throw('All fields are required');
    };

    const optionsArray = options.split('#');
    if (optionsArray.length <= 1) {
        throw('More than one option is required');
    };

    //work out tomorrow's day number
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 1);
    const day = dateObj.getDate();

    let votesArray = [];
    optionsArray.forEach(() => {
        votesArray.push(0);
    });

    if (votesArray.length != optionsArray.length) {
        throw('Votes and options were not the same length');
    };

    //write the poll to firestore
    const firestore = getFirestore();
    await setDoc(doc(firestore, 'polls', String(day)), {
        question: question,
        options: optionsArray,
        voters: [],
        votes: votesArray,
    });

    return 'Poll sucsessfuly added/updated'
}