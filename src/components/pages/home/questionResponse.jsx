import React, {useEffect, useState} from 'react';
import {getFirestore, query, where, collection, getDocs, documentId} from 'firebase/firestore';

export default function QuestionRespnse({postData, postersUserName}) {
    
    //get all data regarding the post
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [username, setUsername] = useState('');
    const [userPost, setUserPost] = useState('');
    const [votes, setVotes] = useState(0);
    const [userReputation, setUserReputation] = useState(0);
    
    useEffect(() => {

        setUsername(postersUserName);
        setVotes(postData.votes);
        setUserPost(postData.post);
        
        //now get the data about the user
        async function getUserData(username) {

            //to prevent data does not exist errors
            try {
                const firestore = getFirestore();
                const userData = query(collection(firestore, 'users'), where(documentId(), '==', username));
                const userDataSnap = await getDocs(userData);

                //save the user data to a map and then return it
                let res = {};
                userDataSnap.forEach((doc) => {
                    res = doc.data();
                });
                
                return res;
            }
            catch(error) {
                console.error(error);
            }; 
        };
        
        //get user data from firestore and save it to state
        getUserData(postersUserName).then((userData) => {

            setUserReputation(userData.reputation);
            setProfilePictureURL(userData.profilePictureURL);
        });
    }, []);
    
    //reusable style
    const noVerticalPaddingOrMargin = {marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0};

    return (
        <div className="questionResponseWrapper">
            <table style={{marginTop: 0, padding: '10px'}}>
                <thead>
                    <tr>
                        <td style={{width: '30%'}}>

                            {/*PROFILE PICTURE*/}
                            <div id="profilePictureWrapper" style={noVerticalPaddingOrMargin}>
                                <img src={profilePictureURL} alt={`${username}'s profile picture`} className="profilePicture" />
                            </div>
                        </td>
                        <td>
                            <button onClick={() => {
                                //take current post viewer to the post maker's page
                            }} style={noVerticalPaddingOrMargin}>

                                {/*POST MAKER'S NAME*/}
                                <h3 style={noVerticalPaddingOrMargin} className="alignLeft">
                                    {username}
                                </h3>
                            </button>
                        </td>
                        <td>
                            <p className="alignRight" style={noVerticalPaddingOrMargin}>
                                Reputation: {userReputation}
                            </p>
                        </td>
                    </tr>
                </thead>
            </table>

            {/*ACTUAL POST*/}
            <table style={noVerticalPaddingOrMargin}>
                <thead>
                    <tr>
                        <td style={{width: '80%'}}>
                            <h2 style={{marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: '2vh', fontSize: '25px'}}>
                                {userPost}
                            </h2>
                        </td>
                        <td>
                            <button type="button" style={noVerticalPaddingOrMargin} onClick={() => {
                                //upvote post
                            }}>
                                <h3 style={noVerticalPaddingOrMargin}>
                                    /\
                                </h3>
                            </button>
                        </td>
                        <td>
                            <p style={noVerticalPaddingOrMargin}>
                                {votes}
                            </p>
                        </td>
                        <td>
                            <button type="button" style={noVerticalPaddingOrMargin} onClick={() => {
                                //downvote post
                            }}>
                                <h3 style={noVerticalPaddingOrMargin}>
                                    \/
                                </h3>
                            </button>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
    );
};