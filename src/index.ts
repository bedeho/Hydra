import { GraphQLServer, Options } from 'graphql-yoga'
import { prisma, BalanceWhereInput } from './generated/prisma-client'


import scannerStarter from './scanner'

import { registerJoystreamTypes } from '@joystream/types';

import Resolvers from './joystream/Resolvers'

const WS_PROVIDER_ENDPOINT_URI = 'wss://rome-staging-2.joystream.org/staging/rpc/';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  Resolvers,
  context: { prisma },
})

const server_options = {
  port: 400
} as Options;

server.start(server_options,() => console.log(`Server is running on http://localhost:${server_options.port}`))

scannerStarter(, WS_PROVIDER_ENDPOINT_URI, registerJoystreamTypes, );