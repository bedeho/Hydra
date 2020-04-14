// @ts-check

import { Options } from 'graphql-yoga'
import { QueryNodeManager} from './query-node'
import { Resolvers } from './joystream'

import { registerJoystreamTypes } from '@joystream/types'

// Constants
const WS_PROVIDER_ENDPOINT_URI = 'wss://rome-staging-2.joystream.org/staging/rpc/'
const GRAPHQL_SERVER_OPTIONS = {
  port: 400
} as Options
const SCHEMA_PATH = './src/schema.graphql'
const RESOLVERS = Resolvers

// Lets go, create a manager that winds down
// when process exits.
let query_node_manager = new QueryNodeManager(process);

// Fire it up
query_node_manager.start(WS_PROVIDER_ENDPOINT_URI, registerJoystreamTypes, SCHEMA_PATH, Resolvers, GRAPHQL_SERVER_OPTIONS)
