// @ts-check


import { Hash, Header, BlockNumber } from '@polkadot/types/interfaces';
import { Callback } from '@polkadot/types/types';

import { 
    QueryBlockProducer,
    QueryBlockConsumer,
    QueryEventProcessingPack,
    QueryEvent,
    QueryEventBlock,
    ISubstrateQueryService } from '.'

const debug = require('debug')('index')


export default class IndexBuilder {

    private _producer: QueryBlockProducer

    private _processing_pack: QueryEventProcessingPack

    private constructor() {

    }

    static create(service) : IndexBuilder {

        let producer = new QueryBlockProducer

        return new IndexBuilder(producer)
    }

    async start() {

        let producer = new QueryBlockProducer(service)
    
        // STORE THIS SOMEWHERE
        producer.on('QueryEventBlock', (query_event_block: QueryEventBlock):void => {
    
            
    
            this._onQueryEventBlock(query_event_block)
        })
    
        debug('Spawned worker.')
        
        // open database??
    
        // Setup worker
        await producer.start();
        
        debug('Started worker.')
    }

    async stop() {

    }

    _onQueryEventBlock(query_event_block: QueryEventBlock):void {

        debug(`Yay, block producer at height: #${query_event_block.block_number}`)

        query_event_block.query_events.forEach((query_event, index) => {

            if(!this._processing_pack[query_event.event_name]) 
            {
                debug(`Unrecognized: ` + query_event.event_name)
                query_event.log(0,debug)
            }
                
            //else 
            //    debug(`Recognized: ` + query_event.event_name)
        })

    }
}
