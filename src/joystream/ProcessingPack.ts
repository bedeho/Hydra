
export default ProcessingPack:QueryEventProcessingPack = {
    'system.ExtrinsicSuccess': (query_event: QueryEvent) => {

        debug(`system.ExtrinsicSuccess: processing...`)

        query_event.log(0,debug)
    },
    'balances.NewAccount': (query_event: QueryEvent) => {

        debug(`balances.NewAccount: processing...`)
    },
};