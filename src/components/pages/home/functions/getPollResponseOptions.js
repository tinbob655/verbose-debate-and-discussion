import React from 'react';

export function getPollRepsonseOptions(pollOptions) {

    function getInnerPollOptions() {
        let innerOptionsHTML = [];
        pollOptions.forEach((pollOption) => {
            innerOptionsHTML.push(
                <React.Fragment>
                    <tr style={{width: '100%'}}>
                        <td style={{width: '25%'}}>
                            <input type="radio" id={pollOption} className="radio growOnHover centered" name="pollResponse" value={pollOption} required></input>
                        </td>
                        <td style={{width: '75%'}}>
                            <label htmlFor={pollOption} className="nextToRadio" style={{marginRight: 0}}>
                                {pollOption}
                            </label>
                        </td>
                    </tr>
                </React.Fragment>
            );
        });

        return innerOptionsHTML;
    };

    return <table style={{width: '80%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
        <thead>
            {getInnerPollOptions()}
        </thead>
        </table>       
};