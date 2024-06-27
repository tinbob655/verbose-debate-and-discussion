import React from 'react';

export function getPartyOptions() {
    let partyOptionsHTML = [];
    partyOptionsHTML.push(
        <React.Fragment>
            <table style={{width: '40%'}} className="centered">
                <thead>
                    {getInnerPartyOptions()}
                </thead>
            </table>
        </React.Fragment>
    );

    function getInnerPartyOptions() {
        let innerPartyOptionsHTML = [];
        const partyOptions = [
            {backendName: 'labour', frontendName: 'Labour Party'},
            {backendName: 'conservative', frontendName: 'Conservative Party'},
            {backendName: 'liberalDemocrats', frontendName: 'Liberal Democrats'},
            {backendName: 'reformUK', frontendName: 'Reform UK'},
            {backendName: 'green', frontendName: 'Green Party'},
            {backendName: 'workersParty', frontendName: "Worker's Party"},
            {backendName: 'scottishNationalParty', frontendName: 'Scottish National Party'},
            {backendName: 'alba', frontendName: 'Alba Party'},
            {backendName: 'sinnFein', frontendName: 'Sinn Féin'},
            {backendName: 'plaidCymru', frontendName: 'Plaid Cymru'},
            {backendName: 'alliancePartyOfNorthernIreland', frontendName: 'Alliance Party of Northern Ireland'},
            {backendName: 'socialDemocraticAndLabourParty', frontendName: 'Social, Democratic and Labour Party'},
            {backendName: 'democraticUnionistParty', frontendName: 'Democratic Unionist Party'},
        ];

        partyOptions.forEach((party) => {
            innerPartyOptionsHTML.push(
                <React.Fragment>
                    <tr>
                        <td style={{width: '25%'}}>
                            <input type="radio" id={party.backendName} className="radio growOnHover centered" name="politicalAllegiance" value={party.backendName} required></input>
                        </td>
                        <td>
                            <label htmlFor={party.backendName} className="nextToRadio">
                                {party.frontendName}
                            </label>
                        </td>
                    </tr>
                </React.Fragment>
            );
        });

        return innerPartyOptionsHTML;
    };

    return partyOptionsHTML;
};