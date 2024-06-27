import React from 'react';

export function getPieChartKey(pieChartData) {

    //only run if pie chart data was supplied
    if (!pieChartData.coloursMap) return <></>

    let pieChartKeyHTML = [];

    function getInnerPieChartKey() {
        let innerPieChartKeyHTML = [];
        Object.keys(pieChartData.coloursMap).forEach((option) => {
            innerPieChartKeyHTML.push(
                <React.Fragment>
                    <tr>
                        <td style={{width: '10%'}}>
                            <div style={{backgroundColor: pieChartData.coloursMap[option], width: '25px', height: '25px', border: '2px solid white'}}>
                            </div>
                        </td>

                        <td>
                            <p className="alignLeft noVerticalSpacing">
                                {option}
                            </p>
                        </td>
                    </tr>
                </React.Fragment>
            );
        });
        return innerPieChartKeyHTML;
    };

    pieChartKeyHTML.push(
        <React.Fragment>
            <table style={{width: '40%', marginLeft: 0}}>
                <thead>
                    {getInnerPieChartKey()}
                </thead>
            </table>
        </React.Fragment>
    );

    return pieChartKeyHTML;
};