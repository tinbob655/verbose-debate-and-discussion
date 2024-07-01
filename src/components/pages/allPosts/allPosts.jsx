import React, {useState, useEffect} from 'react';
import { useAuth } from '../../../context/authContext';
import QuestionRespnse from '../home/questionResponse/questionResponse';
import { today } from '../../../index.js';
import {getFirestore, query, collection, getDocs, orderBy} from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function AllPosts() {

    const {auth} = useAuth();

    const [quesitonResponses, setQuestionResponses] = useState(<></>);

    useEffect(() => {
        const thisDay = today();
        const allMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const month = allMonths[thisDay.month];

        //get all responses from today's question
        let questionResponsesHTML = [];
        const firestore = getFirestore()
        const responsesQuery = query(collection(firestore, 'questionResponses'), orderBy('votes', 'desc'));
        getDocs(responsesQuery).then((docs) => {
            docs.forEach((doc) => {
                questionResponsesHTML.push(
                <div style={{width: '75%'}}>
                    <QuestionRespnse postData={doc.data()} postersUserName={doc.id} />;
                </div>)
            });

            setQuestionResponses(questionResponsesHTML);
        });
    });

    return <React.Fragment>

        <h1 style={{paddingBottom: 0, marginBottom: 0}}>
            All responses
        </h1>

        <div id="backArrowWrapper">
            <Link to='/'>
                <h1>
                    ⬅
                </h1>
            </Link>
        </div>

        <p className="noVerticalSpacing">
            Keeping the question interesting
        </p>

        <div className="dividerLine"></div>
        {quesitonResponses}
    </React.Fragment>
};