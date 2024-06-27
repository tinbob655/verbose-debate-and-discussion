import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {getFirestore, updateDoc, doc} from 'firebase/firestore'

export async function profilePictureFormSubmitted(uploadedImage, auth, username) {

    //only run if a file was uploaded and auth exists
    if (!uploadedImage || !auth) return;


    //work out the file extension of the image uploaded
    const filename = uploadedImage.name;
    const fileExtension = filename.split('.')[1];

    const storage = getStorage();
    const imageRef = ref(storage, `uploadedProfilePictures/${username}.${fileExtension}`);
    await uploadBytes(imageRef, uploadedImage)

    //get the url of the uploaded image and set it as the profile picture url of the user in firestore
    const downloadURL = await getDownloadURL(ref(storage, `uploadedProfilePictures/${username}.${fileExtension}`))   
    const firestore = getFirestore();
    await updateDoc(doc(firestore, 'users', auth.uid),  {
        profilePictureURL: downloadURL,
    });

    return downloadURL;
};