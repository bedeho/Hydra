// @ts-check

import { Options } from 'graphql-yoga'
import { registerJoystreamTypes } from '@joystream/types'
import { ProcessingPack, Resolvers } from './joystream'
import {QueryNode} from './query-node'

// Constants
const WS_PROVIDER_ENDPOINT_URI = 'wss://rome-staging-2.joystream.org/staging/rpc/';
const GRAPHQL_SERVER_OPTIONS = {
  port: 400
} as Options;

// Make a query node
let queryNode = QueryNode.create()

// Start in anymous async closure
async () => {
  await queryNode.start()
}()

// When application is about to stop, lets
// shut down query node as well
process.on('exit', async function(code) {
  await queryNode.stop()
});
