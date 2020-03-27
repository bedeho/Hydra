// @ts-check

import { ApiPromise, WsProvider, /*RuntimeVersion*/ } from '@polkadot/api';
import { Hash, Header, BlockNumber } from '@polkadot/types/interfaces';
import { Callback } from '@polkadot/types/types';

import { QueryBlockProducer, QueryEventBlock, ISubstrateQueryService } from './substrate'
import { registerJoystreamTypes } from '@joystream/types';
import QueryBlockConsumer from './substrate/QueryBlockConsumer';

const debug = require('debug')('index')

const WS_PROVIDER_ENDPOINT_URI = 'wss://rome-staging-2.joystream.org/staging/rpc/';

async function starter() {

    // Initialise the provider to connect to the local node
    const provider = new WsProvider(WS_PROVIDER_ENDPOINT_URI);

    // register types before creating the api
    registerJoystreamTypes();

    // Create the API and wait until ready
    const api = await ApiPromise.create({provider});

    const service = makeService(api);

    let producer = new QueryBlockProducer(service);
    let consumer = new QueryBlockConsumer({})

    producer.on('QueryEventBlock', (query_event_block: QueryEventBlock):void => {

        debug(`Yay, block producer at height: #${query_event_block.block_number}`);

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

export default starter

