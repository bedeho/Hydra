import QueryNode, {QueryNodeState} from './QueryNode'
import { Options } from 'graphql-yoga'
import EventEmitter from 'events'

// Respondible for creating, starting up and shutting down the query node.
// Currently this class is a bit thin, but it will almost certainly grow
// as the integration logic between the library types and the application 
// evolves, and that will pay abstraction overhead off in terms of testability of otherwise
// anonymous code in root file scope.    
export default class QueryNodeManager {

    private _query_node: QueryNode
  
    constructor(exitEmitter: EventEmitter) {
  
      // Hook into application
      process.on('exit', async function(code) {
        this._onProcessExit()
      });
  
    }
  
    async start(ws_provider_endpoint_uri: string, type_registrator: () => void, schema_path: string, resolvers, graphql_server_options: Options) {
  
      if(this._query_node)
        throw Error('Cannot start the same manager multiple times.')
  
      this._query_node = await QueryNode.create(ws_provider_endpoint_uri, type_registrator, schema_path, resolvers)
  
      await this._query_node.start(graphql_server_options)
  
    }
  
    async _onProcessExit(code) {
  
        // Stop if query node has been constructed and started.
        if(this._query_node && this._query_node.state == QueryNodeState.STARTED) {
            await this._query_node.stop()
        }
  0
    }

}