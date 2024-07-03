import React, {useState, useEffect, memo} from 'react';
import QuestionRespnse from '../home/questionResponse/questionResponse';
import {getFirestore, query, collection, getDocs, orderBy} from 'firebase/firestore';
import { useIsMobile } from '../../../context/isMobileContext.jsx';
import { Link } from 'react-router-dom';

function AllPosts() {

    const [quesitonResponses, setQuestionResponses] = useState(<></>);

    const {isMobile} = useIsMobile();

    useEffect(() => {

        //get all responses from today's question
        let questionResponsesHTML = [];
        const firestore = getFirestore()
        const responsesQuery = query(collection(firestore, 'questionResponses'), orderBy('votes', 'desc'));
        getDocs(responsesQuery).then((docs) => {
            docs.forEach((doc) => {
                questionResponsesHTML.push(
                <div style={isMobile ? {width: '50%'} : {width: '95%'}}>
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

export default memo(AllPosts);
