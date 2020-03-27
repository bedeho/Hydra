import { EventRecord, Extrinsic } from '@polkadot/types/interfaces';

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

}