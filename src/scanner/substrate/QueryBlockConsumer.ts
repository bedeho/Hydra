// @ts-check

import QueryEventBlock from './QueryEventBlock'
import QueryEvent from './QueryEvent'

export interface QueryEventProcessingPack {
    [index: string] : (query_event: QueryEvent) => Promise<void>
}

var debug = require('debug')('consumer');

// WIP
export default class QueryBlockConsumer {

    private readonly _processing_pack:QueryEventProcessingPack;

    constructor(processing_pack:QueryEventProcessingPack) {
        this._processing_pack = processing_pack;
    }

    consume(query_event_block: QueryEventBlock) {

        query_event_block.query_events.forEach((query_event, index) => {

            if(!this._processing_pack[query_event.event_name])
                debug(`Unrecognized: ` + query_event.event_name)
            else 
                debug(`Recognized: ` + query_event.event_name)
        })

    }
}

/*
class RichEventProcessor implements RichEventConsumer {

    private _pack: RichEventProcessorPack

    constructor(pack: RichEventProcessorPack) {
        this._pack = pack;
    }

    consume(rich_event: RichEvent) {

        //let name = ..

        console.log(`Block #${rich_event.index.block_number}, event #${rich_event.index.event_index_in_block}`);

        

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
                    
    }
}*/