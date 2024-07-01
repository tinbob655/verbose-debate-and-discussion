import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {getFirestore, query, collection, where, getDocs, getDoc, doc} from 'firebase/firestore';
import SmartImage from '../../multi-page/smartImage.jsx';
import {useAuth} from '../../../context/authContext.jsx';
import {useIsMobile} from '../../../context/isMobileContext.jsx';

import { followUser } from './functions/followUser.js';
import { unfollowUser } from './functions/unfollowUser.js';
import { getFollows } from './functions/getFollows.js';

export default function UserProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;

    const {auth} = useAuth();
    const {isMobile} = useIsMobile();

    const [userProfilePictureURL, setUserProfilePictureURL] = useState('');
    const [userReputation, setUserReputation] = useState(0);
    const [userBio, setUserbio] = useState(null);
    const [userId, setUserId] = useState(null);
    const [alreadyFollowing, setAlreadyFollowing] = useState(false);
    const [userFollows, setUserFollows] = useState({following: 0, followers: 0});

    useEffect(() => {

        //get the user data from firestore and save it to state
        const firestore = getFirestore();
        const getUserData = async() => {
            const userFileQuery = query(collection(firestore, 'users'), where('username', '==', username));
            const userDataSnap = await getDocs(userFileQuery);

            let fileData = {};
            userDataSnap.forEach((file) => {
                const foreignUid = file.id
                setUserId(foreignUid, userId);
                fileData = file.data();

                //also check if the local user is following the user on this page
                getDoc(doc(firestore, 'users', auth.uid)).then((doc) => {
                    if (doc.data().following.indexOf(foreignUid) != -1) {
        
                        //local user is already following the displayed user on this page
                        setAlreadyFollowing(true);
                    };
                });

                //get how many people follow the user, and how many people the user follows. Save this to state
                getFollows(foreignUid).then((res) => {setUserFollows(res)})
            });

            return fileData;
        };

        getUserData()
        .then((data) => {
            setUserProfilePictureURL(data.profilePictureURL);
            setUserReputation(data.reputation);
            setUserbio(data.bio);
        });
    }, []);

    //desktop page
    if (!isMobile) {
        return (
            <React.Fragment>
                <h1 style={{paddingBottom: 0, marginBottom: 0}}>
                    {username}
                </h1>
                <p className="noVerticalSpacing">
                    Find more about them
                </p>
    
                <div className="dividerLine"></div>
    
        
    
                <div id="backArrowWrapper">
                    <button type="button" onClick={() => {navigate(-1)}}>
                        <h1>
                            ⬅
                        </h1>
                    </button>
                </div>
    
                <table style={{tableLayout: 'unset'}}>
                    <thead>
                        <tr>
                            <td style={{width: '25%'}}>
                                <SmartImage imageURL={userProfilePictureURL} imageClasses="profilePicture" imageStyles={{width: '15vw', height: '15vw', marginLeft: '4vw', border: '5px solid #353535', marginBottom: 0, paddingBottom: 0}} />
                            </td>
    
                            <td colSpan={2}>
                                <h2 className="alignLeft noVerticalSpacing">
                                    Bio:
                                </h2>
                                <p className="alignLeft noVerticalSpacing" style={{marginLeft: '1%', width: '70%'}}>
                                    {/*user bio*/}
                                    {userBio ? userBio : "This user has not yet created a bio!"}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {/*follow user button*/}
                                <div style={auth.uid === userId ? {display: 'none'} : {marginTop: 0}}>
                                    {alreadyFollowing ? (
    
                                        //user is already following 
                                        <React.Fragment>
                                            <p style={{marginTop: '3vh', paddingTop: 0}}>
                                                You are following {username}
                                            </p>
                                            <button type="button" className="noVerticalSpacing" onClick={() => {
                                                if (auth) {
                                                    unfollowUser(auth.uid, userId).then((res) => {setAlreadyFollowing(res)});
                                                }
                                                else navigate('/account');
                                            }}>
                                                <h3 className="noVerticalSpacing">
                                                    Unfollow
                                                </h3>
                                            </button>
                                        </React.Fragment>
                                    ) : (
    
                                        //user is not already following
                                        <React.Fragment>
                                            <button type="button" style={{marginTop: 0, paddingTop: 0}} onClick={() => {
                                                if (auth.uid) {
                                                    followUser(auth.uid, userId).then((res) => {setAlreadyFollowing(res)});
                                                }
                                                else navigate('/account');
                                            }}>
                                                <h3 className="noVerticalSpacing">
                                                    Follow {username}
                                                </h3>
                                            </button>
                                        </React.Fragment>
                                    )}
                                </div>
                            </td>
    
                            <td style={{width: '40%'}}>
                                {/*following / followers section*/}
                                <h2 style={{marginTop: 0, paddingTop: 0}}>
                                    Follows
                                </h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <td style={{borderRight: '2px solid white'}}>
                                                <p className="noVerticalSpacing">
                                                    {username} follows {userFollows.following} {userFollows.following === 1 ? 'person' : 'people'}
                                                </p>
                                            </td>
                                            <td>
                                                <p className="noVerticalSpacing">
                                                    {userFollows.followers} {userFollows.followers === 1 ? 'person follows' : 'people follow'} {username}
                                                </p>
                                            </td>
                                        </tr>
                                    </thead>
                                </table>
                            </td>
    
                            <td>
                                {/*user reputation*/}
                                <h2 className="alignRight noVerticalSpacing" style={{marginRight: '10%'}}>
                                    Reputation:
                                </h2>
                                <p className="alignRight noVerticalSpacing" style={{marginRight: '10%', fontSize: '50px'}}>
                                    {userReputation}
                                </p>
                            </td>
                        </tr>
                    </thead>
                </table>
            </React.Fragment>
        );
    }

    //mobile page
    else {
        return (
            <React.Fragment>
                <h1 style={{paddingBottom: 0, marginBottom: 0}}>
                    {username}
                </h1>
                <p className="noVerticalSpacing">
                    Find more about them
                </p>
    
                <div className="dividerLine"></div>
    
                <div id="backArrowWrapper">
                    <button type="button" onClick={() => {navigate(-1)}}>
                        <h1>
                            ⬅
                        </h1>
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>

                                <SmartImage imageURL={userProfilePictureURL} imageClasses="profilePicture" imageStyles={{width: '30vw', height: '30vw', marginLeft: '4vw', border: '5px solid #353535', marginBottom: 0, paddingBottom: 0}} />
                            </td>
                            <td>
                                <h2 className="alignRight noVerticalSpacing">
                                    Bio:
                                </h2>
                                <p className="alignLeft noVerticalSpacing" style={{wordWrap: 'break-word'}}>
                                    {/*user bio*/}
                                    {userBio ? userBio : "This user has not yet created a bio!"}
                                </p>
                            </td>
                        </tr>
                    </thead>
                </table>

                {/*user reputation*/}
                <h2 className=" noVerticalSpacing">
                    Reputation:
                </h2>
                <p className=" noVerticalSpacing" style={{fontSize: '50px'}}>
                    {userReputation}
                </p>
    
                <div className="dividerLine"></div>

                {/*follow user button*/}
                <div style={auth.uid === userId ? {display: 'none'} : {marginTop: 0}}>
                    {alreadyFollowing ? (

                        //user is already following 
                        <React.Fragment>
                            <p style={{marginTop: '3vh', paddingTop: 0, marginBottom: 0, paddingBottom: '1vh'}}>
                                You are following {username}
                            </p>
                            <button type="button" className="noVerticalSpacing" onClick={() => {
                                if (auth) {
                                    unfollowUser(auth.uid, userId).then((res) => {setAlreadyFollowing(res)});
                                }
                                else navigate('/account');
                            }}>
                                <h3 className="noVerticalSpacing">
                                    Unfollow
                                </h3>
                            </button>
                        </React.Fragment>
                    ) : (

                        //user is not already following
                        <React.Fragment>
                            <button type="button" style={{marginTop: 0, paddingTop: 0}} onClick={() => {
                                if (auth.uid) {
                                    followUser(auth.uid, userId).then((res) => {setAlreadyFollowing(res)});
                                }
                                else navigate('/account');
                            }}>
                                <h3 className="noVerticalSpacing">
                                    Follow {username}
                                </h3>
                            </button>
                        </React.Fragment>
                    )}
                </div>


                {/*following / followers section*/}
                <h2>
                    Follows:
                </h2>
                <table>
                    <thead>
                        <tr>
                            <td style={{borderRight: '5px solid white'}}>
                                <p className="noVerticalSpacing">
                                    {username} follows {userFollows.following} {userFollows.following === 1 ? 'person' : 'people'}
                                </p>
                            </td>
                            <td>
                                <p className="noVerticalSpacing">
                                    {userFollows.followers} {userFollows.followers === 1 ? 'person follows' : 'people follow'} {username}
                                </p>
                            </td>
                        </tr>
                    </thead>
                </table>
            </React.Fragment>
        );
    };
};