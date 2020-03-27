// @ts-check

import { expose } from "threads/worker"
import { Subject, Observable } from "threads/observable"
import QueryBlockProducer from './QueryBlockProducer';
import QueryEventBlock from './QueryEventBlock';
import ISubstrateQueryService from "./ISubstrateQueryService";
import { assert } from "@polkadot/util";

class StartedWorkerState {

    readonly producer: QueryBlockProducer;
    readonly subject: Subject<QueryEventBlock>;

    constructor(producer: QueryBlockProducer, subject: Subject<QueryEventBlock>) {

        this.producer = producer;
        this.subject = subject;
    }
}

import { ApiPromise, WsProvider, /*RuntimeVersion*/ } from '@polkadot/api';
import { Hash, Header, BlockNumber } from '@polkadot/types/interfaces';
import { Callback } from '@polkadot/types/types';


// TODO
// MOVE THIS OUT LATER SOME HOW
import { registerJoystreamTypes } from '@joystream/types';


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

let started_state:StartedWorkerState|null = null;

const producer_worker = {
    async setup(endpoint: string) {

        if(started_state)
            throw Error('Worker has already been setup');

        // Initialise the provider to connect to the local node
        const provider = new WsProvider(endpoint);

        // register types before creating the api
        registerJoystreamTypes();

        // Create the API and wait until ready
        const api = await ApiPromise.create({provider});

        const service = makeService(api);

        let producer = new QueryBlockProducer(service);

        let subject = new Subject<QueryEventBlock>();

        started_state = new StartedWorkerState(producer, subject);

        producer.on('QueryEventBlock', onQueryBlockProducerFromProducerWorker);

    },
    start(at_block?: number) {

        if(!started_state)
            throw Error('Worker has not been setup');

        return started_state.producer.start(at_block);
    },
    stop() {

        if(!started_state)
            throw Error('Worker has not been setup');

        return started_state.producer.stop();
    },
    query_event_blocks() {

        if(!started_state)
            throw Error('Worker has not been setup');

        return Observable.from(started_state.subject);
    }
}

function onQueryBlockProducerFromProducerWorker(query_event_block: QueryEventBlock): void {

    assert(started_state, 'Must be started for query event block to be produced.');

    started_state.subject.next(query_event_block);
}

export type ProducerWorker = typeof producer_worker;

expose(producer_worker);