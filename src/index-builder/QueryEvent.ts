import { EventRecord, Extrinsic } from '@polkadot/types/interfaces';
import { Int } from '../generated/prisma-client';

export default class QueryEvent {

    readonly event_record: EventRecord;

    readonly extrinsic?: Extrinsic;

    constructor(event_record: EventRecord, extrinsic?:Extrinsic) {
        this.event_record = event_record;
        this.extrinsic = extrinsic;
    }

    get event_name(): string {

        let event = this.event_record.event

        return event.section + '.'+ event.method
    }

    log(indent: Int, logger: (string) => void) : void {

        // Extract the phase, event
        const { event, phase } = this.event_record

        logger(`\t\t\tParameters:`)
        event.data.forEach((data, index) => {
            logger(`\t\t\t\t${event.typeDef[index].type}: ${data.toString()}`)
        })
    
        logger(`\t\t\tExtrinsic: ${this.extrinsic? this.extrinsic.method.sectionName + '.' + this.extrinsic.method.methodName : 'NONE'}`)
        logger(`\t\t\t\tPhase: ${phase.toString()}`)
        
        if(this.extrinsic) {
            logger(`\t\t\t\tParameters:`)
            this.extrinsic.args.forEach((arg, index) => {
                logger(`\t\t\t\t\t${arg.toRawType()}: ${arg.toString()}`)
            })
        }

    }

}