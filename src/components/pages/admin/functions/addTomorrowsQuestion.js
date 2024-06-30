import {getFirestore, updateDoc, setDoc, doc} from 'firebase/firestore';

export async function addTomorrowsQuestion(event, uid) {
    event.preventDefault();

    const newQuestion = event.currentTarget.tomorrowsQuestion.value;

    //make sure a new question was provided
    if (!newQuestion) {
        throw('No question provided');
    }
    else if (uid !== process.env.REACT_APP_ADMIN_UID) {
        throw('Invalid user');
    };

    const firestore = getFirestore();
    
    //work out the date tomorrow
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const dateObj = new Date;
    dateObj.setDate(dateObj.getDate() + 1);
    const date = dateObj.getDate();
    const month = months[dateObj.getMonth()];

    //if a new month document is required
    if (date === 1) {
        await setDoc(doc(firestore, 'questions', month), {
            [date]: newQuestion,
        });
    }
    else {

        //write the new question to firestore
        await updateDoc(doc(firestore, 'questions', month), {
            [date]: newQuestion,
        });
    
    };

    return 'Question sucsessfully added/updated';

};