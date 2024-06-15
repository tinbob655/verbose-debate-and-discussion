import React, {useEffect, useState} from 'react';

export default function QuestionRespnse({positionOnLeaderboard}) {
    const noVerticalPaddingOrMargin = {marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0};
    return (
        <div className="questionResponseWrapper">
            <table style={{marginTop: 0, padding: '10px'}}>
                <thead>
                    <tr>
                        <td style={{width: '30%'}}>
                            {/*PROFILE PICTURE*/}
                            <div id="profilePictureWrapper" style={noVerticalPaddingOrMargin}>
                                PROFILE_PICTURE
                            </div>
                        </td>
                        <td>
                            <button onClick={() => {
                                //take current post viewer to the post maker's page
                            }} style={noVerticalPaddingOrMargin}>
                                {/*POST MAKER'S NAME*/}
                                <h3 style={noVerticalPaddingOrMargin} className="alignLeft">
                                    Vinyl5five
                                </h3>
                            </button>
                        </td>
                        <td>
                            <p className="alignRight" style={noVerticalPaddingOrMargin}>
                                USER_REPUTATION
                            </p>
                        </td>
                    </tr>
                </thead>
            </table>

            {/*ACTUAL POST*/}
            <table style={noVerticalPaddingOrMargin}>
                <thead>
                    <tr>
                        <td style={{width: '80%'}}>
                            <p style={{marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: '2vh'}}>
                                "USER'S REPLY TO MAIN QUESTION"
                            </p>
                        </td>
                        <td>
                            <button type="button" style={noVerticalPaddingOrMargin} onClick={() => {
                                //upvote post
                            }}>
                                <h3 style={noVerticalPaddingOrMargin}>
                                    /\
                                </h3>
                            </button>
                        </td>
                        <td>
                            <p style={noVerticalPaddingOrMargin}>
                                0
                            </p>
                        </td>
                        <td>
                            <button type="button" style={noVerticalPaddingOrMargin} onClick={() => {
                                //downvote post
                            }}>
                                <h3 style={noVerticalPaddingOrMargin}>
                                    \/
                                </h3>
                            </button>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
    );
};