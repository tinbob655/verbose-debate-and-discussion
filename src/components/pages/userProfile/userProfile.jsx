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
                            <p className="alignLeft" style={{marginLeft: '5%', maxWidth: '80%'}}>
                                {/*user bio*/}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu quam, condimentum nec porttitor in, dignissim nec sapien. Nulla id enim pulvinar justo porttitor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et faucibus enim, ac venenatis sapien. Nulla commodo magna vitae mi euismod, ut gravida nisi fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque nunc ac eros fermentum fringilla. In eu turpis at velit aliquam condimentum. In porttitor ex tristique, scelerisque mi vitae, sagittis neque. Fusce metus dui, pulvinar et lorem ac, malesuada tristique tellus. Pellentesque mollis felis diam, vitae elementum mi rhoncus sit amet. Nunc et orci sed odio pellentesque aliquet eu in magna. Integer consectetur varius nisl et blandit.
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

            <h2 className="alignLeft noVerticalSpacing">
                Recent activity:
            </h2>
            <p className="alignLeft noVerticalSpacing" style={{maxWidth: '75%'}}>
            Aenean lacinia libero arcu, at euismod leo tempus molestie. Fusce suscipit augue ac feugiat ornare. Nullam porttitor ullamcorper orci id elementum. Phasellus congue dictum mauris sed sodales. Morbi bibendum nisl ac nibh tempus convallis. Maecenas tellus libero, lobortis vitae est in, sagittis tempus augue. Integer vel pharetra elit. Quisque varius, tellus et ornare lobortis, ex ipsum ultrices metus, sit amet cursus velit nibh eget tortor. Aliquam vel dolor luctus, lobortis nisl et, ornare metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc ut ex vel ligula ornare vehicula. Quisque vitae facilisis urna, a tempus enim. Etiam posuere, nunc et feugiat laoreet, velit ipsum luctus ex, et porta lacus dui in est.
            </p>
        </React.Fragment>
    )
};