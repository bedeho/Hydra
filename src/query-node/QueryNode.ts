// @ts-check

import { GraphQLServer, Options } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import { ApiPromise, WsProvider, /*RuntimeVersion*/ } from '@polkadot/api'
import { makeQueryService } from './index-builder'

import IndexBuilder from './index-builder/IndexBuilder'

enum QueryNodeState {
    NOT_STARTED,
    STARTING,
    STARTED,
    STOPPING,
}

export default class QueryNode {

    // State of the node,
    public _state: QueryNodeState

    // Server providing the user facing GraphQL API.
    private _graphQLServer: GraphQLServer

    // API instance for talking to Substrate full node.
    private _api: ApiPromise

    // Query index building node.
    private _indexBuilder: IndexBuilder

    // ..
    private _websocketProvider: WsProvider


    private constructort() {
        this._state = QueryNodeState.NOT_STARTED

    }

    static create(
        graphQL_typeDefs,
        graphQL_resolves
        typeDefs: './src/schema.graphql',
        resolvers: Resolvers
    ): QueryNode {

                // TODO: Do we really need to do it like this?
        // Its pretty ugly, but the registrtion appears to be
        // accessing some sort of global state, and has to be done after
        // the provider is created.
        
        // Register types before creating the api
        registerJoystreamTypes()
        
        // Create the API and wait until ready
        this._api = await ApiPromise.create({provider})
        
        const service = makeQueryService(api)
        
        const indexBuider = new IndexBuilder(service, )

                
        // Initialise the provider to connect to the local node
        const provider = new WsProvider()

        const graphQLServer = new GraphQLServer({
            typeDefs: graphQL_typeDefs,
            resolvers: graphQL_resolves,
            context: { prisma },
          })

        const indexBuider = new IndexBuilder(service, )


        return new QueryNode()
    }

    async start(graphlServerOptions: Options) {

        if(this._state != QueryNodeState.NOT_STARTED)
            throw new Error('Starting requires ')

        
        // Start the GraphQL API server
        this._graphQLServer.start(graphlServerOptions,
            () => console.log(`Server is running on http://localhost:${server_options.port}`)
        )


        // Start the 
        await IndexBuilder.start()

    }

    async stop() {
        throw new Error('Not implemented yet!')
    }
}