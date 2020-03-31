// @ts-check

import { ApiPromise, WsProvider, /*RuntimeVersion*/ } from '@polkadot/api';
import { Hash, Header, BlockNumber } from '@polkadot/types/interfaces';
import { Callback } from '@polkadot/types/types';

import { 
    QueryBlockProducer,
    QueryBlockConsumer,
    QueryEventProcessingPack,
    QueryEvent,
    QueryEventBlock,
    ISubstrateQueryService } from './substrate'

const debug = require('debug')('index')

export default async function scannerStarter(ws_provider_endpoint_uri: string, pack: QueryEventProcessingPack, type_registrator: () => void) {

    // Initialise the provider to connect to the local node
    const provider = new WsProvider(ws_provider_endpoint_uri)

    // TODO: Do we really need to do it like this?
    // Its pretty ugly, but the registrtion appears to be
    // accessing some sort of global state, and has to be done after
    // the provider is created.

    // Register types before creating the api
    type_registrator()

    // Create the API and wait until ready
    const api = await ApiPromise.create({provider})

    const service = makeService(api);

    let producer = new QueryBlockProducer(service)
    let consumer = new QueryBlockConsumer(pack)

    producer.on('QueryEventBlock', (query_event_block: QueryEventBlock):void => {

        debug(`Yay, block producer at height: #${query_event_block.block_number}`)

        consumer.consume(query_event_block)
    })

    debug('Spawned worker.')
    
    // open database??

    // Setup worker
    await producer.start();
    
    debug('Started worker.')
}
