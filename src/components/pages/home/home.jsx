import React, {useEffect, useState} from 'react';
import {getDoc, doc, getFirestore, getDocs, orderBy, where, limit, query, collection, documentId, setDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import QuestionResponse from './questionResponse.jsx';
import SmartImage from '../../multi-page/smartImage.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/authContext.jsx';
import {today} from '../../../index.js';
import './homeStyles.scss';

export default function Home() {

    const navigate = useNavigate();

    const {auth} = useAuth();

    const [question, setQuestion] = useState('');
    const [top5Posts, setTop5Posts] = useState(null);
    const [userProfilePicture, setUserProfilePicture] = useState('');
    const [respondButtonStyle, setRespondButtonStyle] = useState(null);

    useEffect(() => {

        //if the user is logged in, fetch their profile picture
        if (auth) {
            getUserProfilePicture();
        }
        else {

            //if the user is not logged in then grey out the respond button
            setRespondButtonStyle({color: 'grey'});
        }

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
            const top5PostsQuery = query(collection(firestore, 'questionResponses'), orderBy('votes', 'desc'), limit(5));
            const querySnap = await getDocs(top5PostsQuery);
            querySnap.forEach((doc) => {
                top5posts.push(doc);
            });

            return top5posts;
        };

        getTop5Posts().then((posts) => {
            setTop5Posts(posts);
        });
    }, []);

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
                            <div id="todaysQuestionWrapper">
                                <h2>
                                    Today's Question:
                                </h2>

                                <button type="button" onClick={() => {
                                    if (!auth) {

                                        //if the user was not logged in, take them to the account page
                                        navigate('/account');
                                    };
                                    document.getElementById('yourResponseWrapper').classList.add('shown');
                                }}>
                                    <h3 style={respondButtonStyle}>
                                        {question}
                                    </h3>
                                </button>
                                <div id="yourResponseWrapper">
                                    <form id="yourResponseForm" onSubmit={(event) => {
                                        questionResponseFormSubmitted(event);
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
                        </td>
                        <td>
                            {/*TOP RESPONSES SECTION*/}
                            <h2>
                                Top responses:
                            </h2>
                            {getTop5PostsComponents()}
                        </td>
                    </tr>
                </thead>
            </table>
        </React.Fragment>
    );

    function getTop5PostsComponents() {
    
        //only run if the posts have been fetched
        if (!top5Posts) {
            return <></>
        }
        else {
            let top5PostsHTML = [];
    
            top5Posts.forEach((post) => {
                top5PostsHTML.push(<QuestionResponse postData={post.data()} postersUserName={post.id}/>)
            });
    
            return top5PostsHTML;
        };
    };
    
    function getUserProfilePicture() {
    
        const getUserFile = async() => {
            const firestore = getFirestore();
            const uid = auth.uid;
            const userFileQuery = query(collection(firestore, 'users'), where(documentId(), '==', uid));
            const userFileSnap = await getDocs(userFileQuery);
    
            let res = {};
            userFileSnap.forEach((user) => {
                res = user.data();
            });
    
            return res;
        }
    
        getUserFile()
        .then((res) => {
            setUserProfilePicture(res.profilePictureURL);
        });
    };

    async function questionResponseFormSubmitted(event) {
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
};