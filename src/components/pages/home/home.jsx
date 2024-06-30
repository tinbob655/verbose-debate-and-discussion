import React, {useEffect, useState} from 'react';
import {getDoc, doc, getFirestore, getDocs, orderBy, where, limit, query, collection, documentId} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SmartImage from '../../multi-page/smartImage.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/authContext.jsx';
import {today} from '../../../index.js';
import { PieChart } from 'react-minimal-pie-chart';
import './homeStyles.scss';

import { getTop5PostsComponents } from './functions/getTop5PostComments.js';
import { questionResponseFormSubmitted } from './functions/questionResponseFormSubmitted.js';
import { getUserProfilePicture } from './functions/getUserProfilePicture.js';
import { pollResponseFormSubmitted } from './functions/pollResponseFormSubmitted.js';
import { getPollRepsonseOptions } from './functions/getPollResponseOptions.js';
import { getPieChartData } from './functions/getPieChartData.js';
import { getPieChartKey } from './functions/getPieChartKey.js';
import { filterTopResponsesBy } from './functions/filterTopResponsesBy.js';

export default function Home() {

    const navigate = useNavigate();

    const {auth} = useAuth();

    const [question, setQuestion] = useState('');
    const [top5PostsHTML, setTop5PostsHTML] = useState(null);
    const [userProfilePicture, setUserProfilePicture] = useState('');
    const [respondButtonStyle, setRespondButtonStyle] = useState(null);
    const [poll, setPoll] = useState('');
    const [pieChartData, setPieChartData] = useState([]);
    const [pollFormStyles, setPollFormStyles] = useState({marginRight: 'auto'});
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState(null);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {

        //get the question
        const getQuestion = async() => {
            
            let currentDate = today();
            //get the question from firestore
            let question;
            try {

                const firestore = getFirestore();
                let docRef = doc(firestore, 'questions', currentDate.month);
                question = (await getDoc(docRef)).data()[currentDate.day];
            }
            catch {};

            //if there was no question provided today
            if (typeof question !== 'string') {
                question = 'No Question Available';
            }
            else {
                question = '"'+question+'"'
            }

            return question;
        };

        getQuestion().then((question) => {
            setQuestion(question);
        });

        const getTop5Posts = async() => {

            const firestore = getFirestore();

            //get the top 5 posts by reputation from firestore
            let top5posts = [];
            const top5PostsQuery = query(collection(firestore, 'questionResponses'), orderBy('votes', 'desc'), limit(3));
            const querySnap = await getDocs(top5PostsQuery);
            querySnap.forEach((doc) => {
                top5posts.push(doc);
            });

            return top5posts;
        };

        getTop5Posts().then((posts) => {
            setTop5PostsHTML(getTop5PostsComponents(posts));
        });

        //get today's poll from firestore
        const firestore = getFirestore();
        const currentDate =  today();
        const pollQuery = query(collection(firestore, 'polls'), where(documentId(), '==', String(currentDate.day)), limit(1));
        let options = [];
        let pollQuestion = '';
        getDocs(pollQuery)
        .then((docs) => {
            docs.forEach((doc) => {
                pollQuestion = doc.data().question
                doc.data().options.forEach((option) => {
                    options.push(option);
                });
            });

            setPoll({
                question: pollQuestion,
                options: options,
            });
        });

    }, []);

    useEffect(() => {
        
        //if the user is logged in, fetch their profile picture
        if (auth) {
            getUserProfilePicture(auth)
            .then((res) => {
             setUserProfilePicture(res);
            });
 
            //also check if the user has already voted in the poll
            getDoc(doc(getFirestore(), 'polls', String(today().day))).then((doc) => {
             if (doc.data() && doc.data().voters.indexOf(auth.uid) != -1) {
 
                 //the user has already voted
                 getPieChartData().then((dat) => {
                     setPieChartData(dat);
                     setPollFormStyles({visibility: 'hidden'});
                 });
             };
            });

            //the user is logged in, so make the question and the poll not greyed out
            setRespondButtonStyle(null);
         }
         else {
 
             //if the user is not logged in then grey out the respond button
             setRespondButtonStyle({color: 'grey'});
         }
    }, [auth]);

    useEffect(() => {

        if (timerActive) {

            let timer = 9;
            setPleaseWaitMessage('PLease wait 10 seconds before changing filter again')
    
            const timerInterval = setInterval(() => {
                if (timer > 0) {
                    setPleaseWaitMessage(`Please wait ${timer} ${timer === 1 ? 'second' : 'seconds'} before changing filter again`);
                    timer--;
                }
                else {
                    clearInterval(timerInterval);
                    setPleaseWaitMessage(null);
                    setTimerActive(false);
                };
            }, 1000);
        };
    }, [timerActive]);

    return (
        <React.Fragment>

            <h1 style={{paddingTop: '3vh', paddingBottom: 0, marginTop: 0, marginBottom: 0, fontSize: '70px'}}>
                Verbose
            </h1>

            {/*account button*/}
            <div style={{position: 'absolute', top: 0, right: '5px'}}>
                <Link to='/account'>
                <button type="button">
                    <SmartImage imagePath={!auth ? 'interactiveElements/accountIcon.png' : null} imageURL={auth ? userProfilePicture : null} imageStyles={auth ? {height: '7vw', width: '7vw', border: '5px solid #353535', marginRight: '1vw'} : {height: '150px', width: 'auto'}} imageClasses={auth ? 'growOnHover profilePicture' : 'growOnHover'} />
                </button>
                </Link>
            </div>

            <p style={{padding: 0, margin: 0}}>
                Debate and Discussion
            </p>

            <div className="dividerLine"></div>

            <table style={{tableLayout: 'unset', padding: '2%'}}>
                <thead>
                    <tr>
                        <td style={{width: '65%'}}>

                            {/*TODAY'S QUSETION SECTION*/}
                            <div className="todaysQuestionWrapper">
                                <h2>
                                    Today's Question:
                                </h2>

                                <button type="button" onClick={() => {
                                    if (!auth) {

                                        //if the user was not logged in, take them to the account page
                                        navigate('/account');
                                    };
                                    document.getElementById('yourResponseWrapper').classList.toggle('shown');
                                }}>
                                    <h3 style={respondButtonStyle}>
                                        {question}
                                    </h3>
                                </button>
                                <div id="yourResponseWrapper">
                                    <form id="yourResponseForm" onSubmit={(event) => {
                                        questionResponseFormSubmitted(event, auth);
                                    }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td style={{width: '90%'}}>
                                                        <p className="noVerticalSpacing" style={{marginBottom: '2vh'}}>
                                                            Your response:
                                                        </p>
                                                        <textarea id="yourResponseText" name="yourResponseText" style={{width: '95%'}} rows="4" required placeholder="Write your response..."></textarea>
                                                    </td>
                                                    <td>
                                                        <label htmlFor="submit">
                                                            <SmartImage imagePath="interactiveElements/sendIcon.png" imageClasses="growOnHover" />
                                                        </label>
                                                        <input type="submit" id="submit" name="submit" value="submit" style={{display: 'none'}}></input>
                                                    </td>
                                                </tr>
                                            </thead>
                                        </table>
                                    </form>
                                </div>
                            </div>

                            {/*POLL SECTION*/}
                            <div className="todaysQuestionWrapper" id="todaysQuestionPieWrapper" style={{width: '75%', marginLeft: 0, marginTop: '5vh'}}>
                                <h2>
                                    Today's Poll:
                                </h2>

                                <p>
                                    {poll.question ? poll.question : 'No poll available'}
                                </p>
                                {/*poll response form*/}
                                <div id="entirePollAndPieChartWrapper" style={poll.question ? {} : {visibility: 'hidden', display: 'none'}}>
                                    <form id="pollResponseForm" style={pollFormStyles} onSubmit={(event) => {
                                        if (auth) {
                                            pollResponseFormSubmitted(event, poll.options, auth).then(() => {
                                                getPieChartData().then((data) => {
                                                    setPieChartData(data)
                                                });
                                            });
                                        }
                                        else navigate('/account');
                                        }}>
                                        <div id="pollOptionsWrapper">
                                            {poll ? getPollRepsonseOptions(poll.options) : <></>}
                                        </div>

                                        <input type="submit" className="submit" value="Submit" id="pollSubmit"></input>
                                    </form>
                                    
                                    {/*pie chart key*/}
                                    <div id="pieChartKeyWrapper">
                                        {getPieChartKey(pieChartData)}
                                    </div>
                                    
                                    {/*pie chart*/}
                                    <div id="pieChartWrapper">
                                        <PieChart data={pieChartData.data} label={({dataEntry}) => `${dataEntry.percentage === 0 ? '' : Math.round(dataEntry.percentage)+'%'}`} labelStyle={{fontFamily: 'Nunito', fontSize: '4px'}} style={{border: '5px solid #454545', borderRadius: '50%'}} />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            {/*TOP RESPONSES SECTION*/}
                            <h2>
                                Top responses:
                            </h2>

                            {/*filter by...*/}
                            <p className="noVerticalSpacing">
                                {pleaseWaitMessage ? pleaseWaitMessage : 'Filter by:'}
                            </p>
                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            <div className="filterByWrapper activeMode" id="filterByVotesWrapper">
                                                <button type="button" onClick={() => {
                                                    if (!pleaseWaitMessage) {
                                                        setTimerActive(true);
                                                        setTop5PostsHTML(<h2>Loading...</h2>);
                                                        filterTopResponsesBy('votes', auth.uid).then((res) => {
                                                            setTop5PostsHTML(res);
                                                        });
                                                    };
                                                    }}>
                                                    <h3 className="noVerticalSpacing">
                                                        Votes
                                                    </h3>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="filterByWrapper" id="filterByReputationWrapper">
                                                <button type="button" onClick={() => {
                                                    if (!pleaseWaitMessage) {
                                                        setTimerActive(true);
                                                        setTop5PostsHTML(<h2>Loading...</h2>);
                                                        filterTopResponsesBy('reputation', auth.uid).then((res) => {
                                                            setTop5PostsHTML(res)
                                                        });
                                                    };
                                                    }}>
                                                    <h3 className="noVerticalSpacing">
                                                        Reputation
                                                    </h3>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="filterByWrapper" id="filterByFollowingWrapper">
                                                <button type="button" onClick={() => {
                                                    if (!pleaseWaitMessage) {
                                                        setTimerActive(true);
                                                        setTop5PostsHTML(<h2>Loading...</h2>)
                                                        filterTopResponsesBy('following', auth.uid).then((res) => {
                                                            setTop5PostsHTML(res);
                                                        });
                                                    };
                                                    }}>
                                                    <h3 className="noVerticalSpacing">
                                                        Following
                                                    </h3>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                            {top5PostsHTML && top5PostsHTML.length > 0 ? top5PostsHTML : <p>No responses available</p>}
                        </td>
                    </tr>
                </thead>
            </table>
        </React.Fragment>
    );
};