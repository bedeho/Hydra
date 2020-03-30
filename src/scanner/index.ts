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

export default async function scannerStarter(pack: QueryEventProcessingPack, type_registrator: void => void) {

    // Initialise the provider to connect to the local node
    const provider = new WsProvider(WS_PROVIDER_ENDPOINT_URI)

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

function makeService(api: ApiPromise) : ISubstrateQueryService {

    return  { 
        getHeader: (hash?: Hash | Uint8Array | string) => { return api.rpc.chain.getHeader(hash)},
        getFinalizedHead: () => { return api.rpc.chain.getFinalizedHead();}, 
        subscribeNewHeads: (v: Callback<Header> ) => { return api.rpc.chain.subscribeNewHeads(v); },
        getBlockHash: (blockNumber?: BlockNumber | Uint8Array | number | string) => { return api.rpc.chain.getBlockHash(blockNumber); },
        getBlock: (hash?: Hash | Uint8Array | string) => { return api.rpc.chain.getBlock(hash); },
        eventsAt: (hash: Hash | Uint8Array | string) => { return api.query.system.events.at(hash); }
     } as ISubstrateQueryService;
}

