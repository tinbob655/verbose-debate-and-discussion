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
        });
    }, []);

    return (
        <React.Fragment>
            <h1>
                {username}
            </h1>

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
                            <SmartImage imageURL={userProfilePictureURL} imageClasses="profilePicture" imageStyles={{width: '20vw', height: '20vw', marginLeft: '1vw', border: '5px solid #353535'}} />
                        </td>

                        <td>
                        </td>
                    </tr>
                </thead>
            </table>
        </React.Fragment>
    )
};