import React, {useEffect, useState} from 'react';
import {getFirestore, query, where, collection, getDocs} from 'firebase/firestore';

export default function QuestionRespnse({postData, postersUserName}) {
    
    //get all data regarding the post
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [username, setUsername] = useState('');
    const [userPost, setUserPost] = useState('');
    const [votes, setVotes] = useState(0);
    const [userReputation, setUserReputation] = useState(0);
    
    useEffect(() => {

        setUsername(postersUserName)
        setVotes(postData.votes);
        setUserPost(postData.post);
        
        //now get the data about the user
        async function getUserData(username) {

            //to prevent data does not exist errors
            try {
                const firestore = getFirestore();
                const userData = query(collection(firestore, 'users'), where('username', '==', username));
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

    return (
        <div className="questionResponseWrapper">
            <table style={{marginTop: 0, padding: '10px'}}>
                <thead>
                    <tr>
                        <td style={{width: '30%'}}>

                            {/*PROFILE PICTURE*/}
                            <div id="profilePictureWrapper" className="noVerticalSpacing">
                                <img src={profilePictureURL} alt={`${username}'s profile picture`} className="profilePicture" />
                            </div>
                        </td>
                        <td>
                            <button onClick={() => {
                                //take current post viewer to the post maker's page
                            }} className="noVerticalSpacing">

                                {/*POST MAKER'S NAME*/}
                                <h3 className="noVerticalSpacing alignLeft">
                                    {username}
                                </h3>
                            </button>
                        </td>
                        <td>
                            <p className="noVerticalSpacing alignRight">
                                Reputation: {userReputation}
                            </p>
                        </td>
                    </tr>
                </thead>
            </table>

            {/*ACTUAL POST*/}
            <table className="noVerticalSpacing">
                <thead>
                    <tr>
                        <td style={{width: '80%'}}>
                            <h2 style={{marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: '2vh', fontSize: '25px'}}>
                                {userPost}
                            </h2>
                        </td>
                        <td>

                            {/*UPVOTE DOWNVOTE SECTION*/}
                            <table style={{paddingRight: '10px'}}>
                                <thead>
                                    <tr>
                                        <td>
                                            <button type="button" className="noVerticalSpacing" style={{width: '50%', padding: 0}} onClick={() => {
                                                //upvote post
                                            }}>
                                                <h3 className="noVerticalSpacing">
                                                    /\
                                                </h3>
                                            </button>
                                        </td>

                                        <td>
                                            <p className="noVerticalSpacing" style={{width: '50%'}}>
                                                {votes}
                                            </p>
                                        </td>

                                        <td>
                                            <button type="button" className="noVerticalSpacing" style={{width: '50%', padding: 0}} onClick={() => {
                                                //downvote post
                                            }}>
                                                <h3 className="noVerticalSpacing">
                                                    \/
                                                </h3>
                                            </button>
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
    );
};