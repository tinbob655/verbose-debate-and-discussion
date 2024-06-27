import {getFirestore, updateDoc, doc} from 'firebase/firestore';

export async function bioFormSubmitted(event, auth) {
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
            return userBio;
        }
        catch(error) {
            throw(error);
        };
    };
};