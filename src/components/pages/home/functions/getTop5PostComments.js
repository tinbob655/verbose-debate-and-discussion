import QuestionResponse from '../questionResponse/questionResponse.jsx';

export function getTop5PostsComponents(top5Posts) {
    
    //only run if the posts have been fetched
    if (!top5Posts) {
        return <></>
    }
    else {
        let top5PostsHTML = [];

        top5Posts.forEach((post) => {
            top5PostsHTML.push(<QuestionResponse postData={post.data()} postersUserName={post.id}/>)
        });

        return top5PostsHTML;
    };
};