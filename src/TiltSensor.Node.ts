import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { NodeAttributes, HOMIE_TYPE_BOOL } from "node-homie/model";
import { TiltSensorNodePropertyConfig, H_SMARTHOME_TYPE_TILT_SENSOR } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: TiltSensorNodePropertyConfig = { settable: false }

export class TiltSensorNode extends BaseSmarthomeNode<TiltSensorNodePropertyConfig> {

    public readonly propState: HomieProperty;

    public set state(value: boolean) {
        this.propState.value = String(value);

    }
    public get state(): boolean {
        return this.propState.value === 'true';
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: TiltSensorNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'tilt',
                name: 'Tilt sensor',
                type: H_SMARTHOME_TYPE_TILT_SENSOR
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