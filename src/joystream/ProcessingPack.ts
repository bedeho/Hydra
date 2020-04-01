
// @ts-check

import {QueryEventProcessingPack} './'

var debug = require('debug')('consumer');

export default ProcessingPack:QueryEventProcessingPack = {
    'system.ExtrinsicSuccess': (query_event: QueryEvent) => {

        debug(`system.ExtrinsicSuccess: processing...`)

        query_event.log(0,debug)
    },
    'balances.NewAccount': (query_event: QueryEvent) => {

        debug(`balances.NewAccount: processing...`)
    },
};

/*
                            // Show what we are busy with
                    //console.log(`\t\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
                    //console.log(`\t\t${event.meta.documentation.toString()}`);

                    console.log(`\t\t\tIn extrinsic`);
                    console.log(`\t\t\thash: ${extrinsic.hash.toHex()}`);
                    console.log(`\t\t\tsection name: ${extrinsic.method.sectionName}`);
                    console.log(`\t\t\tmethod name: ${extrinsic.method.methodName}`);
                    console.log(`\t\t\tparameters`);

                                            // Dump parameters
                    extrinsic.args.forEach((arg, index) => {
                        console.log(`\t\t\t\t${index}: ${arg.toString()}`);
                    })
                        
    // Loop through each of the parameters, displaying the type and data
                event.data.forEach((data, index) => {
                    console.log(`\t\t\t\t${types[index].type}: ${data.toString()}`);
                });
*/