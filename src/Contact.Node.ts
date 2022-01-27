import { HomieDevice, HomieProperty } from "node-homie";
import { HomieNodeAtrributes, HOMIE_TYPE_BOOL } from "node-homie/model";
import { ContactNodePropertyConfig, H_SMARTHOME_TYPE_CONTACT } from "./model/Smarthome.model";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: ContactNodePropertyConfig = { settable: false }

export class ContactNode extends BaseSmarthomeNode<ContactNodePropertyConfig> {

    public readonly propState: HomieProperty;

    public set state(value: boolean) {
        this.propState.value = String(value);

    }
    public get state(): boolean {
        return this.propState.value === 'true';
    }

    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: ContactNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'contact',
                name: 'Open/Close contact',
                type: H_SMARTHOME_TYPE_CONTACT
            },
            ...attrs
        }, 
        { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propState = this.makeProperty({
            id: 'state',
            name: 'Open/Close state',
            datatype: HOMIE_TYPE_BOOL,
            retained: true,
            settable: false,
        });

    }
}