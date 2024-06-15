import React, {Component} from 'react';
import {getDoc, doc, getFirestore} from 'firebase/firestore';
import './homeStyles.scss';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            question: '',
        };
    };

    componentDidMount() {

        //get the question
        const getQuestion = async() => {
            //get the current date
            const today = new Date();
            //month
            const allMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
            const month = allMonths[today.getMonth()];
            //day
            const day = today.getDate();

            //get the question from firestore
            let question;
            try {

                const firestore = getFirestore();
                let docRef = doc(firestore, 'questions', month);
                question = (await getDoc(docRef)).data()[day];
            }
            catch {
                console.log('No question found');
            };

            //if there was no question provided today
            if (typeof question !== 'string') {
                question = 'No Question Available';
            }
            else {
                question = '"'+question+'"'
            }

            return question;
        };

        getQuestion().then((question) => {
            this.setState({question: question });
        });
    };

    render() {
        return(
            <React.Fragment>
                <h1 style={{paddingTop: '3vh', paddingBottom: 0, marginTop: 0}}>
                    Verbose
                </h1>

                <div className="dividerLine"></div>

                <table style={{tableLayout: 'unset'}}>
                    <thead>
                        <tr>
                            <td style={{width: '65%'}}>

                                {/*TODAY'S QUSETION SECTION*/}
                                <div id="todaysQuestionWrapper">
                                    <h2>
                                        Today's Question:
                                    </h2>

                                    <button type="button" onClick={() => {
                                        //answer question button
                                    }}>
                                        <h3>
                                            {this.state.question}
                                        </h3>
                                    </button>
                                </div>
                            </td>
                            <td>
                                {/*TOP RESPONSES SECTION*/}
                                <h2>
                                    Top responses:
                                </h2>
                            </td>
                        </tr>
                    </thead>
                </table>

            </React.Fragment>
        );
    };
};

export default Home;