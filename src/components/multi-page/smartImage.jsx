import React, {useState, useEffect} from 'react';
import {getStorage, getDownloadURL, ref} from 'firebase/storage';

function SmartImage({imageClasses, imageStyles, imageURL, imagePath}) {

    const [fetchedImageURL, setFetchedImageURL] = useState(null);

    useEffect(() => {

        //if a imagePath was specified, get it's url from firesbase storage
        if (imagePath) {
            const storage = getStorage();
            getDownloadURL(ref(storage, imagePath)).then((url) => {
                setFetchedImageURL(url);
            });
        };
    });

    //validation
    //either imageURL or imagePath is required
    if (!imageURL && !imagePath) {
        throw('No source file specified for smart image');
    }
    //both an image path and an imageURL are not allowed at the same time
    else if (imageURL && imagePath) {
        throw('Cannot render a smart image when provided with both an imageURL and an imagePath');
    }

    //if all checks were passed, render the image
    else {
        return (
            <React.Fragment>
                <img className={imageClasses} imageStyles={imageStyles} src={imagePath ? fetchedImageURL : imageURL} />
            </React.Fragment>
        );
    };
};

export default SmartImage;