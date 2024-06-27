import React, {useEffect, useState} from 'react';
import {getFirestore, query, where, collection, getDocs, updateDoc, increment, doc, getDoc, arrayUnion} from 'firebase/firestore';
import { useAuth } from '../../../../context/authContext.jsx';
import { Link, Navigate } from 'react-router-dom';

export default function QuestionRespnse({postData, postersUserName}) {

    const {auth} = useAuth();

    const [greyedOut, setGreyedOut] = useState(false);
    const [autoNav, setAutoNav] = useState(<></>);
    
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
        
        //check if the currently logged in user has already interacted with this post
        if (auth) {
            const firestore = getFirestore();
            const uid = auth.uid
            const docRef = doc(firestore, 'questionResponses', postersUserName);
            getDoc(docRef)
            .then((doc) => {
                const voters = doc.data().voters;
                voters.forEach((voter) => {
                    if (voter === uid) {
                        setGreyedOut(true);
                    };
                });
            });
        };
        
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
                            <Link to={'/userProfile'} state={{username: postersUserName /*username goes here*/}} >
                                <img src={profilePictureURL} alt={`${username}'s profile`} className="profilePicture growOnHover" />
                            </Link>
                        </td>
                        <td>
                            <Link to={'/userProfile'} state={{username: postersUserName /*uid goes here*/}} >
                                {/*POST MAKER'S NAME*/}
                                <h3 className="noVerticalSpacing alignLeft">
                                    {username}
                                </h3>
                            </Link>
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
                                                changeVotes(1);
                                            }}>
                                                <h3 className={`noVerticalSpacing ${greyedOut ? 'greyedOut' : ''}`} >
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
                                                changeVotes(-1);
                                            }}>
                                                <h3 className={`noVerticalSpacing ${greyedOut ? 'greyedOut' : ''}`}>
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
            {autoNav}
        </div>
    );

    async function changeVotes(ammount) {

        //only run if the use is logged in
        if (auth) {
            const firestore = getFirestore();
            const firestorePostRef = doc(firestore, 'questionResponses', username);
    
            //check if the user who voted has already voted on this post
            const voters = await getDoc(firestorePostRef);
            voters.data().voters.forEach((voter) => {
                if (voter === auth.uid) {
                    throw ('Already voted on this post');
                };
            });
    
            //increment the votes on the post
            await updateDoc(firestorePostRef, {
                votes: increment(ammount),
            });
    
            //add the user to the list of voters
            await updateDoc(firestorePostRef, {
                voters: arrayUnion(auth.uid),
            });
    
            //update local post votes
            setVotes(votes + ammount);
    
            //grey out the vote buttons
            setGreyedOut(true);
        }
        else {

            //if the user is not logged in, take them to the account page
            setAutoNav(<Navigate to="/account" />);
        };
    };
};