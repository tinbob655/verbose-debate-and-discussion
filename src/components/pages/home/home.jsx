import React, {Component} from 'react';
import {getDoc, doc, getFirestore, getDocs, orderBy, where, limit, query, collection, documentId} from 'firebase/firestore';
import QuestionResponse from './questionResponse.jsx';
import SmartImage from '../../multi-page/smartImage.jsx';
import { Link } from 'react-router-dom';
import {today} from '../../../index.js';
import './homeStyles.scss';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            question: '',
        };
    };

    componentDidMount() {

        //if the user is logged in, fetch their profile picture
        if (sessionStorage.getItem('user')) {
            this.getUserProfilePicture();
        };

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
            this.setState({question: question });
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
            this.setState({
                top5Posts: posts,
            });
        });
    };

    render() {
        return(
            <React.Fragment>

                <h1 style={{paddingTop: '3vh', paddingBottom: 0, marginTop: 0, marginBottom: 0, fontSize: '70px'}}>
                    Verbose
                </h1>

                {/*account button*/}
                <div style={{position: 'absolute', top: 0, right: '5px'}}>
                    <Link to='/account'>
                    <button type="button">
                        <SmartImage imagePath={!sessionStorage.getItem('user') ? 'interactiveElements/accountIcon.png' : null} imageURL={sessionStorage.getItem('user') ? this.state.userProfilePicture : null} imageStyles={sessionStorage.getItem('user') ? {height: '7vw', width: '7vw', border: '5px solid #353535', marginRight: '1vw'} : {height: '150px', width: 'auto'}} imageClasses={sessionStorage.getItem('user') ? 'growOnHover profilePicture' : 'growOnHover'} />
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
                                        //answer question button
                                    }}>
                                        <h3>
                                            {this.state.question}
                                        </h3>
                                    </button>
                                </div>
                            </td>
                            <td>
                                {/*TOP RESPONSES SECTION*/}
                                <h2>
                                    Top responses:
                                </h2>
                                {this.getTop5PostsComponents()}
                            </td>
                        </tr>
                    </thead>
                </table>
            </React.Fragment>
        );
    };

    getTop5PostsComponents() {

        //only run if the posts have been fetched
        if (!this.state.top5Posts) {
            return <></>
        }
        else {
            let top5PostsHTML = [];
    
            this.state.top5Posts.forEach((post) => {
                top5PostsHTML.push(<QuestionResponse postData={post.data()} postersUserName={post.id}/>)
            });
    
            return top5PostsHTML;
        };
    };

    getUserProfilePicture() {

        const getUserFile = async() => {
            const firestore = getFirestore();
            const uid = JSON.parse(sessionStorage.getItem('user')).uid;
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
            this.setState({userProfilePicture: res.profilePictureURL});
        });
    };
};

export default Home;