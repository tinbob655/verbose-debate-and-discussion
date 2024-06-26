import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {getFirestore, query, collection, where, getDocs} from 'firebase/firestore';
import SmartImage from '../../multi-page/smartImage.jsx';

export default function UserProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;

    const [userProfilePictureURL, setUserProfilePictureURL] = useState('');
    const [userReputation, setUserReputation] = useState(0);
    const [userBio, setUserbio] = useState(null);

    useEffect(() => {

        //get the user data from firestore and save it to state
        const getUserData = async() => {
            const firestore = getFirestore();
            const userFileQuery = query(collection(firestore, 'users'), where('username', '==', username));
            const userDataSnap = await getDocs(userFileQuery);

            let fileData = {};
            userDataSnap.forEach((file) => {
                fileData = file.data()
            });

            return fileData;
        };

        getUserData()
        .then((data) => {
            setUserProfilePictureURL(data.profilePictureURL);
            setUserReputation(data.reputation);
            setUserbio(data.bio)
        });
    }, []);

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
                            <SmartImage imageURL={userProfilePictureURL} imageClasses="profilePicture" imageStyles={{width: '20vw', height: '20vw', marginLeft: '1vw', border: '5px solid #353535'}} />
                        </td>

                        <td>
                            <h2 className="alignLeft">
                                Bio:
                            </h2>
                            <p className="alignLeft noVerticalSpacing" style={{marginLeft: '1%', width: '70%'}}>
                                {/*user bio*/}
                                {userBio ? userBio : "That user has not yet created a bio!"}
                            </p>
                        </td>
                    </tr>
                </thead>
            </table>

            <h2 className="alignRight noVerticalSpacing" style={{marginRight: '10%'}}>
                Reputation:
            </h2>
            <p className="alignRight noVerticalSpacing" style={{marginRight: '10%', fontSize: '50px'}}>
                {userReputation}
            </p>
        </React.Fragment>
    )
};