import { getTop5PostsComponents } from "./getTop5PostComments.js";
import {getFirestore, getDocs, query, collection, limit, orderBy, where, documentId, getDoc, doc} from 'firebase/firestore';

export async function filterTopResponsesBy(filterMode, uid) {

    //update frontend
    document.querySelectorAll('.filterByWrapper').forEach((wrapperDiv) => {
        const id = wrapperDiv.id.substring(8).split('W')[0].toLowerCase();

        if (wrapperDiv.classList.contains('activeMode') && filterMode != id) {
            wrapperDiv.classList.remove('activeMode');
        }
        else if (filterMode === id) {
            wrapperDiv.classList.add('activeMode');
        };
    });

    //get the new top 5 posts with the new ordering system
    const firestore = getFirestore();
    switch (filterMode) {
        default:
            throw('Invalid filter mode');
        case 'votes':

            //if the selected filtering mode is 'votes', order by votes
            const newTop5PostsQuery = query(collection(firestore, 'questionResponses'), limit(3), orderBy('votes', 'desc'));
            const newTop5PostsDoc = await getDocs(newTop5PostsQuery);
            let newTop5Posts = [];
            newTop5PostsDoc.forEach((doc) => {
                newTop5Posts.push(doc);
            });

            return getTop5PostsComponents(newTop5Posts);

        case 'reputation':

            //if the seleted filtering mode was reputation
            let top5PostsArray = [];
            const allUserFilesQuery = query(collection(firestore, 'users'), orderBy('reputation', 'desc'));
            const allUserFilesSnap = await getDocs(allUserFilesQuery);
            let allUserFiles = [];
            allUserFilesSnap.forEach((file) => {
                allUserFiles.push(file.data().username);
            });

            //keep repeating until 3 posts have been found
            let increment = 0;
            while (top5PostsArray.length < 3 && increment <= allUserFiles.length -1) {
                const thisUsername = allUserFiles[increment];

                //check if this user made a post to the question, if so add it to the array
                const userPostsDocs = await getDocs(query(collection(firestore, 'questionResponses'), where(documentId(), '==', thisUsername)));
                userPostsDocs.forEach((doc) => {
                    top5PostsArray.push(doc);
                });

                increment++;
            };

            return getTop5PostsComponents(top5PostsArray);

        case 'following':
            if (!uid) throw('No uid provided');
            
            //if the selected filtering mode was 'following', then get a list of the current user's followers
            const userFile = await getDoc(doc(firestore, 'users', uid));
            const userFollowing = userFile.data().following;



            //for every user that the current user is following, check if they have responded to today's question, if so, add them to the array
            let followingFilterArray = [];
            let i = 0;
            while (followingFilterArray.length < 3 && i < userFollowing.length) {

                //get the person being followed's username
                const followingUserFile = await getDoc(doc(firestore, 'users', userFollowing[i]));
                const userFollowingUsername = followingUserFile.data().username;

                //if the user being followed has responded to today's question, add their response to the array
                const userFollowingPostDoc = await getDocs(query(collection(firestore, 'questionResponses'), where(documentId(), '==', userFollowingUsername)));
                userFollowingPostDoc.forEach((document) => {
                    if (document.exists()) {
                        followingFilterArray.push(document);
                    };
                });
                i++;
            };

            console.log('test')

            return getTop5PostsComponents(followingFilterArray);
    };
};