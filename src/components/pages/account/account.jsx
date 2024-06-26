import React, {useEffect, useState} from 'react';
import './accountStyles.scss';
import SmartImage from '../../multi-page/smartImage.jsx';
import {doc, setDoc, getFirestore, query, where, collection, documentId, getDocs, updateDoc, getDoc} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/authContext.jsx';
import {getStorage, getDownloadURL, ref, uploadBytes} from 'firebase/storage';

//auth modules
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';

export default function Account() {

    const {auth, updateAuth} = useAuth();

    const [loggedIn, setLoggedIn] = useState(auth ? true : false);
    const [userProfilePictureURL, setUserProfilePictureURL] = useState(undefined);
    const [username, setUsername] = useState('');
    const [reputation, setReputation] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const [bio, setBio] = useState(null);
    const [remainingCharacters, setRemainingCharacters] = useState(200);

    //listener for auth changes
    getAuth().onAuthStateChanged((user) => {
        updateAuth(user);
    });

    useEffect(() => {
        
        //if the user is logged in, get their profile picture url and save it to state
        if (loggedIn) {

            //get the user's user id
            const user = auth.uid;
    
            //if there is no user, then do not proceed
            if (!user) {
                throw('auth.uid was null')
            };
    
            //get the user's data from firestore
            const getUserData = async() => {
                const firestore = getFirestore();
                const userFile = query(collection(firestore, 'users'), where(documentId(), '==', user));
                const userPfp = await getDocs(userFile);
        
                let userData = {};
                userPfp.forEach((user) => {
                    userData = {
                        pfp: user.data().profilePictureURL,
                        username: user.data().username,
                        reputation: user.data().reputation,
                    };
                });
        
                return userData;
            };
    
            getUserData()
            .then((userData) => {
                setUserProfilePictureURL(userData.pfp);
                setUsername(userData.username);
                setReputation(userData.reputation);
            });
        };

    }, [loggedIn]);

    return(
        <React.Fragment>
            <h1 style={{paddingBottom: 0, margin: 0, fontSize: '70px', paddingTop: '3vh'}}>
                Your account
            </h1>
            <p style={{padding: 0, margin: 0}}>
                Be part of the party
            </p>

            <div id="backArrowWrapper">
                <Link to='/'>
                    <h1>
                        ⬅
                    </h1>
                </Link>
            </div>

            <div className="dividerLine"></div>

            {/*if the user is not logged in, show a "log in / sign up" page, if the user is logged in, then show an account page*/}
            {loggedIn === true ?
            //ACCOUNT PAGE
            <React.Fragment>
                <table>
                    <thead>
                        <tr>
                            <td>
                                <img src={userProfilePictureURL} className="profilePicture" style={{width: '20vw', height: '20vw', marginLeft: '1vw', border: '5px solid #353535'}} />

                                {/*upload profile picture form*/}
                                <label htmlFor="imageUpload">
                                    <SmartImage imagePath="interactiveElements/pencil.jpg" imageStyles={{height: 'auto', width: '25%', marginTop: '15px'}} imageClasses="centered growOnHover" />
                                </label>
                                <input type="file" id="imageUpload" accept="image/*" style={{display: 'none'}} onChange={(event) => {
                                    profilePictureFormSubmitted(event.target.files[0]);
                                }} />
                            </td>
                            <td style={{width: '75%', paddingRight: '2vw'}}>
                                <h1>
                                    Welcome back, {username}
                                </h1>
                                <h2 className="alignLeft" style={{marginBottom: 0, paddingBottom: 0}}>
                                    Your current reputation is: {reputation}
                                </h2>
                                <p className="noVerticalSpacing alignLeft">
                                    Gain reputation by being active. Make posts, vote in polls and respond to other posts.<br/> Your reputation can fall if toxic behaviour is
                                    detected.
                                </p>

                                <h2 className="alignRight" style={{marginBottom: 0, paddingBottom: 0}}>
                                    Bio:
                                </h2>
                                {bio ? (
                                    //if the user's has a bio, show the bio with an button to edit it
                                    <React.Fragment>
                                        <p className="alignRight noVerticalSpacing" style={{width: '80%', marginLeft: '18%'}}>
                                            {bio}
                                        </p>

                                        <button type="button" onClick={() => {setBio(null)}}>
                                            <h3 style={{float: 'right'}}>
                                                Change your bio here
                                            </h3>
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    //if the user does not have a bio, show a button to add a bio
                                    <React.Fragment>
                                        <form id="bioForm" onSubmit={(event) => {bioFormSubmitted(event)}} onChange={(event) => {
                                            const inputtedTextLength = event.currentTarget.userBioInput.value.length;
                                            const remainingCharacters = 200 - inputtedTextLength;

                                            if (remainingCharacters < 0) {
                                                throw('Negative remaining characters');
                                            }
                                            else {
                                                setRemainingCharacters(remainingCharacters);
                                            };
                                        }} >
                                            <p className="noVerticalSpacing alignRight">
                                                Create your bio:
                                            </p>

                                            <table>
                                                <thead>
                                                    <tr>
                                                        <td style={{width: '93%'}}>
                                                            <textarea id="userBioInput" name="userBioInput" style={{width: '75%', marginRight: '10px', marginTop: '15px', marginBottom: '5px', paddingBottom: 0}} rows="4" maxLength={200} required placeholder="Write your bio..." >
                                                            </textarea>
                                                        </td>
                                                        <td>
                                                            <label htmlFor="submit">
                                                                <SmartImage imagePath="interactiveElements/sendIcon.png" imageClasses="growOnHover"></SmartImage>
                                                            </label>
                                                            <input id="submit" name="submit" type="submit" value="Submit" style={{display: 'none'}}></input>
                                                        </td>
                                                    </tr>
                                                </thead>
                                            </table>

                                            <p className="noVerticalSpacing alignRight" style={{fontSize: '15px'}}>
                                                {remainingCharacters}/200
                                            </p>
                                        </form>
                                    </React.Fragment>
                                )}
                            </td>
                        </tr>
                    </thead>
                </table>

                {/*SIGN OUT BUTTON*/}
                <button type="button" onClick={() => {signUserOut()}}>
                    <h3>
                        Sign out
                    </h3>
                </button>
            </React.Fragment>
            :
            //LOG IN / SIGN UP PAGE
            <React.Fragment>
                <h2>
                    Sign up or log in
                </h2>
                <p>
                    It's easy, just choose to log in or to sign up below
                </p>

                <table>
                    <thead>
                        <tr>
                            <td id="logInCell">
                                <div id="logInButtonWrapper">
                                    <button type="button" onClick={() => {
                                        document.getElementById('logInContentWrapper').classList.toggle('selected');
                                        document.getElementById('signUpContentWrapper').classList.remove('selected');
                                        }}>
                                        <h3>
                                            Log in
                                        </h3>
                                    </button>

                                </div>
                            </td>
                            <td id="signUpCell">
                                <div id="signUpButtonWrapper">
                                    <button type="button" onClick={() => {
                                        document.getElementById('logInContentWrapper').classList.remove('selected');
                                        document.getElementById('signUpContentWrapper').classList.toggle('selected');
                                    }}>
                                        <h3>
                                            Sign up
                                        </h3>
                                    </button>

                                </div>
                            </td>
                        </tr>
                    </thead>
                </table>
                {/*LOG IN SECTION*/}
                <div id="logInContentWrapper">
                    <h2>
                        Log in
                    </h2>

                    <div className="hiddenErrorWrapper" id="loginHiddenErrorWrapper">
                        <p style={{color: 'red'}}>
                            {errorMessage}
                        </p>
                    </div>

                    {/*log in form*/}
                    <form id="logInForm" onSubmit={(event) => {logInFormCompleted(event)}}>

                        <p className="noVerticalSpacing">
                            Email:
                        </p>
                        <input type="email" name="email" placeholder="Enter email here..." required></input>

                        <p className="noVerticalSpacing">
                            Password:
                        </p>
                        <input type="password" name="password" placeholder="Enter password here..." required></input>

                        <input type="submit" name="submit" className="submit"></input>
                    </form>
                </div>

                {/*SIGN UP SECTION*/}
                <div id="signUpContentWrapper">
                    <h2>
                        Sign up
                    </h2>

                    <div className="hiddenErrorWrapper" id="signUpHiddenErrorWrapper">
                        <p style={{color: 'red'}}>
                            {errorMessage}
                        </p>
                    </div>

                    {/*sign up form*/}
                    <form id="signUpForm" onSubmit={(event) => {signUpFormCompleted(event)}}>

                        <p className="noVerticalSpacing">
                            Email:
                        </p>
                        <input type="email" name="email" placeholder="Enter email here..." required></input>

                        <p className="noVerticalSpacing">
                            Username:
                        </p>
                        <p className="noVerticalSpacing" style={{fontSize: '15px', color: 'white'}}>
                            Your username cannot be changed. Numbers and letters only
                        </p>
                        <input type="text" name="username" placeholder="Create your username..." required pattern="[a-zA-Z0-9]+"></input>

                        <p className="noVerticalSpacing">
                            Password:
                        </p>
                        <input type="password" name="password" placeholder="Create your password..." required></input>

                        <p className="noVerticalSpacing">
                            Confirm password:
                        </p>
                        <input type="password" name="confirmPassword" placeholder="Confirm your password..." required></input>

                        <p className="noVerticalSpacing">
                            Political allegiance
                        </p>
                        <p className="noVerticalSpacing" style={{fontSize: '15px', color: 'white'}}>
                            We will not store your political allegiance. It is used only to decide your default profile picture
                        </p>
                        {getPartyOptions()}

                        <input type="submit" name="submit" style={{paddingTop: '7px', borderTop: '3px solid white', borderRadius: 'unset'}} className="submit"></input>
                    </form>
                </div>
            </React.Fragment>
            }
        </React.Fragment>
    );

    function getPartyOptions() {
        let partyOptionsHTML = [];
        partyOptionsHTML.push(
            <React.Fragment>
                <table style={{width: '40%'}} className="centered">
                    <thead>
                        {getInnerPartyOptions()}
                    </thead>
                </table>
            </React.Fragment>
        );

        function getInnerPartyOptions() {
            let innerPartyOptionsHTML = [];
            const partyOptions = [
                {backendName: 'labour', frontendName: 'Labour Party'},
                {backendName: 'conservative', frontendName: 'Conservative Party'},
                {backendName: 'liberalDemocrats', frontendName: 'Liberal Democrats'},
                {backendName: 'reformUK', frontendName: 'Reform UK'},
                {backendName: 'green', frontendName: 'Green Party'},
                {backendName: 'workersParty', frontendName: "Worker's Party"},
                {backendName: 'scottishNationalParty', frontendName: 'Scottish National Party'},
                {backendName: 'alba', frontendName: 'Alba Party'},
                {backendName: 'sinnFein', frontendName: 'Sinn Féin'},
                {backendName: 'plaidCymru', frontendName: 'Plaid Cymru'},
                {backendName: 'alliancePartyOfNorthernIreland', frontendName: 'Alliance Party of Northern Ireland'},
                {backendName: 'socialDemocraticAndLabourParty', frontendName: 'Social, Democratic and Labour Party'},
                {backendName: 'democraticUnionistParty', frontendName: 'Democratic Unionist Party'},
            ];

            partyOptions.forEach((party) => {
                innerPartyOptionsHTML.push(
                    <React.Fragment>
                        <tr>
                            <td style={{width: '25%'}}>
                                <input type="radio" id={party.backendName} className="radio growOnHover centered" name="politicalAllegiance" value={party.backendName} required></input>
                            </td>
                            <td>
                                <label htmlFor={party.backendName} className="nextToRadio">
                                    {party.frontendName}
                                </label>
                            </td>
                        </tr>
                    </React.Fragment>
                );
            });

            return innerPartyOptionsHTML;
        };

        return partyOptionsHTML;
    };

    function logInFormCompleted(event) {
        event.preventDefault();

        //make sure an email and a password were provided
        if (!event.currentTarget.email.value || !event.currentTarget.password.value) {
            setErrorMessage('Missing either an email or a password');
            document.getElementById('loginHiddenErrorWrapper').classList.add('shown');
            return;
        }

        //log in the user
        const auth = getAuth();
        signInWithEmailAndPassword(auth, event.currentTarget.email.value, event.currentTarget.password.value)
        .then(() => {
            setLoggedIn(true);
        })
        .catch((error) => {
            if (error.code === 'auth/too-many-requests') {
                setErrorMessage('Too many login attempts, please try again later')
            }
            else {
                setErrorMessage('Incorrect email or password')
            };
            document.getElementById('loginHiddenErrorWrapper').classList.add('shown');
            console.error(error);
        });
    };

    function signUpFormCompleted(event) {
        event.preventDefault();

        //make sure an email and a password were provided
        if (!event.currentTarget.email.value || !event.currentTarget.password.value) {
            setErrorMessage('Missing either an email or a password')
            document.getElementById('signUpHiddenErrorWrapper').classList.add('shown');
            return;

        }
        //make sure a username was entered
        else if (!event.currentTarget.username.value) {
            setErrorMessage('No username was provided');
            document.getElementById('signUpHiddenErrorWrapper').classList.add('shown');
            return;
        }
        //make sure the two passwords match
        else if (event.currentTarget.password.value !== event.currentTarget.confirmPassword.value) {
            setErrorMessage('Passwords do not match');
            document.getElementById('signUpHiddenErrorWrapper').classList.add('shown');
            return;
        };

        //sign up with the user's credentials
        const auth = getAuth();
        const username = event.currentTarget.username.value;
        const politicalAllegiance = event.currentTarget.politicalAllegiance.value;
        createUserWithEmailAndPassword(auth, event.currentTarget.email.value, event.currentTarget.password.value)
        .then( async(userCred) => {

            //get the user's default profile picture using their political allegiance
            const storage = getStorage();
            getDownloadURL(ref(storage, 'defaultProfilePictures/'+politicalAllegiance+'.jpg'))
            .then( async(url) => {

                //create an entry to the user section of firestore for this user
                const firestore = getFirestore();
                await setDoc(doc(firestore, 'users', userCred.user.uid), {
                    username: username,
                    reputation: 0,
                    profilePictureURL: url,
                });

                setLoggedIn(true);
            });

        })

        .catch((error) => {
            if (error.code === 'auth/email-already-exists') {
                setErrorMessage('There is already an account with the email address')
            }
            else if (error.code === 'auth/invalid-password') {
                setErrorMessage('Your password must have at least six characters');
            }
            else {
                setErrorMessage('We encountered an internal server error, please try again')
            }
            document.getElementById('signUpHiddenErrorWrapper').classList.add('shown');
            console.error(error);
        });
    };

    function signUserOut() {
        const auth = getAuth();
        signOut(auth)
        .then(() => {
            setLoggedIn(false);
        })
        .catch((error) => {
            throw(error);
        });
    };

    function profilePictureFormSubmitted(uploadedImage) {

        //only run if a file was uploaded and auth exists
        if (!uploadedImage || !auth) return;


        //work out the file extension of the image uploaded
        const filename = uploadedImage.name;
        const fileExtension = filename.split('.')[1];

        const storage = getStorage();
        const imageRef = ref(storage, `uploadedProfilePictures/${username}.${fileExtension}`);
        uploadBytes(imageRef, uploadedImage)
        .then(() => {

            //get the url of the uploaded image and set it as the profile picture url of the user in firestore
            getDownloadURL(ref(storage, `uploadedProfilePictures/${username}.${fileExtension}`))
            .then( async(url) => {
                
                const firestore = getFirestore();
                await updateDoc(doc(firestore, 'users', auth.uid),  {
                    profilePictureURL: url,
                });

                setUserProfilePictureURL(url);
            });
        });
    };

    async function bioFormSubmitted(event) {
        event.preventDefault();
        const userBio = event.currentTarget.userBioInput.value;

        //once again, make sure the bio is less than 200 characters
        if (userBio.length > 200) {
            throw('Bio was too long');
        }
        else if (userBio.length <= 0) {
            throw('Bio was not long enough');
        }
        else {

            //bio was an acceptable length, write it to the user's bio section in firestore
            const firestore = getFirestore();
            try {
                await updateDoc(doc(firestore, 'users', auth.uid),  {
                    bio: userBio,
                });

                //if updating firestore was sucsessful, then update the local bio
                setBio(userBio);
            }
            catch(error) {
                throw(error);
            };
        };
    };
};