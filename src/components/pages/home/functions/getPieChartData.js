import {getFirestore, getDoc, doc} from 'firebase/firestore';
import { today } from '../../../../index.js';

export async function getPieChartData() {
    let data = [];
    const firestore = getFirestore();

    const postDocRef = doc(firestore, 'polls', String(today().day));
    const postDocSnap = await getDoc(postDocRef);
    const postData = postDocSnap.data();

    const availableColours = ['#1459c7', '#c72314', '#d48f22', '#10d106', '#4ddbd4', '#def511', '#c930b0'];
    const startingValue = Math.floor(Math.random() * availableColours.length);

    for(let i = 0; i < postData.options.length; i++) {
        data.push({
            title: postData.options[i],
            value: postData.votes[i],
            color: availableColours[(startingValue + i) % availableColours.length],
        });
    };

    //also get a map of colours to their respective options
    let coloursMap = {};
    data.forEach((option) => {
        coloursMap[option.title] = option.color;
    });
    
    //create a final object to return all data
    const finalData = {
        data: data,
        coloursMap: coloursMap,
    };

    //update frontend
    document.getElementById('pollOptionsWrapper').classList.add('afterSubmission');
    document.getElementById('pollSubmit').classList.add('hidden');
    document.getElementById('pieChartWrapper').classList.add('shown');
    document.getElementById('todaysQuestionPieWrapper').classList.add('extended');

    //return all data
    return finalData;
};