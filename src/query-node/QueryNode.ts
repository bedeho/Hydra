// @ts-check

import { GraphQLServer, Options } from 'graphql-yoga'
import { prisma } from '../generated/prisma-client'
import { ApiPromise, WsProvider, /*RuntimeVersion*/ } from '@polkadot/api'

import { makeQueryService, IndexBuilder } from '../index-builder'

export enum QueryNodeState {
    NOT_STARTED,
    STARTING,
    STARTED,
    STOPPING,
    STOPPED
}

export default class QueryNode {

    // State of the node,
    private _state: QueryNodeState

    // ..
    private _websocketProvider: WsProvider

    // Server providing the user facing GraphQL API.
    private _graphQLServer: GraphQLServer

    // API instance for talking to Substrate full node.
    private _api: ApiPromise

    // Query index building node.
    private _indexBuilder: IndexBuilder

    private constructort(websocketProvider: WsProvider, graphQLServer: GraphQLServer, api: ApiPromise, indexBuilder: IndexBuilder) {
        this._state = QueryNodeState.NOT_STARTED
        this._websocketProvider = websocketProvider
        this._graphQLServer = graphQLServer
        this._api = api
        this._indexBuilder = indexBuilder
    }

    static async create(
        ws_provider_endpoint_uri,
        type_registrator: () => void,
        graphQL_schema_file_path,
        graphQL_resolves
    ) {

        // TODO: Do we really need to do it like this?
        // Its pretty ugly, but the registrtion appears to be
        // accessing some sort of global state, and has to be done after
        // the provider is created.

        // Initialise the provider to connect to the local node
        const provider = new WsProvider(ws_provider_endpoint_uri);
        
        // Register types before creating the api
        type_registrator()
        
        // Create the API and wait until ready
        const api = await ApiPromise.create({provider})
        
        const service = makeQueryService(api)
        
        const index_buider = IndexBuilder.create(service)

        const graphQLServer = new GraphQLServer({
            typeDefs: graphQL_schema_file_path,
            resolvers: graphQL_resolves,
            context: { prisma },
          })

        return new QueryNode(provider, graphQLServer, api, index_buider)
    }

    async start(graphlServerOptions: Options) {

        if(this._state != QueryNodeState.NOT_STARTED)
            throw new Error('Starting requires ')

        this._state = QueryNodeState.STARTING

        // Start the GraphQL API server
        this._graphQLServer.start(graphlServerOptions,
            () => console.log(`Server is running on http://localhost:${server_options.port}`)
        )

        // Start the 
        await this._indexBuilder.start()

        this._state = QueryNodeState.STARTED
    }

    async stop() {
        
        if(this._state != QueryNodeState.STARTED)
            throw new Error('Can only stop once fully started')

        this._state = QueryNodeState.STOPPING

        await this._indexBuilder.stop()

        this._state = QueryNodeState.STOPPED
    }

    get state() {
        return this._state
    }
}