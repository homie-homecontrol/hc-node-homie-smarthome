import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { NodeAttributes, HOMIE_TYPE_BOOL } from "node-homie/model";
import { TiltNodePropertyConfig, H_SMARTHOME_TYPE_TILT } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: TiltNodePropertyConfig = { settable: false }

export class TiltNode extends BaseSmarthomeNode<TiltNodePropertyConfig> {

    public readonly propState: HomieProperty;

    public set state(value: boolean) {
        this.propState.value = String(value);

    }
    public get state(): boolean {
        return this.propState.value === 'true';
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: TiltNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'tilt',
                name: 'Tilt sensor',
                type: H_SMARTHOME_TYPE_TILT
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propState = this.makeProperty({
            id: 'state',
            name: 'Tilted/Not Tilted state',
            datatype: HOMIE_TYPE_BOOL,
            retained: true,
            settable: false,
        });


    }
}
