import React, {useState} from 'react';
import { today } from '../../../index.js';
import {useAuth} from '../../../context/authContext.jsx';
import { signOut, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { addTomorrowsQuestion } from './functions/addTomorrowsQuestion.js';
import { addTomorrowsPoll } from './functions/addTomorrowsPoll.js';

export default function Admin() {

    const {auth} = useAuth();
    const navigate = useNavigate();

    const [sucsessfulMessage, setSucsessfulMessage] = useState('');

    return(
        <React.Fragment>
            <h1>
                Admin page:
            </h1>

            <p className="noVerticalSpacing">
                Todays's date is:
            </p>
            <h2 className="noVerticalSpacing">
                {today().month} {today().day}
            </h2>
            <p className="noVerticalSpacing">
                If this is incorrect, please log out and back in.
            </p>

            <h2 style={{color: 'yellow'}}>
                {sucsessfulMessage}
            </h2>

            <table>
                <thead>
                    <tr>
                        <td>
                            <h2>
                                Add/update tomorrow's question
                            </h2>
                            
                            <form id="tomorrowsQuestiomForm" onSubmit={(event) => {addTomorrowsQuestion(event, auth.uid).then((res) => {setSucsessfulMessage(res)})}}>
                                <p className="noVerticalSpacing">
                                    New question:
                                </p>
                                <textarea id="tomorrowsQuestion" name="tomorrowsQuestion" placeholder="Enter tomorrow's question..." rows={4} required></textarea>
                                <input type="submit" value="Submit" className="submit"/>
                            </form>
                        </td>

                        <td>
                            <h2>
                                Add/update tomorrow's poll
                            </h2>

                            <form id="tomorrowsPollForm" onSubmit={(event) => {addTomorrowsPoll(event, auth.uid).then((res) => {setSucsessfulMessage(res)})}}>

                                <p className="noVerticalSpacing">
                                    Poll question:
                                </p>
                                <textarea id="question" name="question" placeholder="Enter question..." rows={4} required></textarea>

                                <p className="noVerticalSpacing">
                                    Voting options. SEPARATE EACH OPTION BY A # NO SPACES EITHER SIDE OF THE #
                                </p>
                                <input type="text" name="options" placeholder="Enter options..." required></input>

                                <input type="submit" name="submit" value="Submit" className="submit"></input>
                            </form>
                        </td>
                    </tr>
                </thead>
            </table>

            <button type="button" onClick={() => {signOut(getAuth()).then(() => {navigate('/account')})}}>
                <h3>
                    Sign out
                </h3>
            </button>
        </React.Fragment>
    );
};