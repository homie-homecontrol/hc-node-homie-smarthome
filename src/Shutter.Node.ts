import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_INT, HomieNodeAtrributes, HOMIE_TYPE_BOOL } from "node-homie/model";
import { H_SMARTHOME_TYPE_SHUTTER, ShutterNodePropertyConfig } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: ShutterNodePropertyConfig = { canStop: true, settable: true };


export class ShutterNode extends BaseSmarthomeNode<ShutterNodePropertyConfig> {


    public readonly propPosition: HomieProperty;
    public readonly propUp: HomieProperty;
    public readonly propDown: HomieProperty;
    public readonly propStop?: HomieProperty;

    public set position(value: number) {
        // if (!this.propState.lowBattery) { return; }
        this.propPosition.value = String(value);

    }
    public get position(): number {
        // if (!this.propState.lowBattery) { return undefined; }
        return this.propPosition.value ? parseInt(this.propPosition.value) : 0;
    }

    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: ShutterNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'shutter',
                name: 'Shutter control',
                type: H_SMARTHOME_TYPE_SHUTTER
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propPosition = this.add(new HomieProperty(this, {
            id: 'position',
            name: 'Shutter position',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: this.propConfig.settable === true,
            unit: '%'
        }, getPropertyOptions(propConfig)));

        this.propUp = this.add(new HomieProperty(this, {
            id: 'up',
            name: 'Scroll shutter up',
            datatype: HOMIE_TYPE_BOOL,
            retained: false,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        this.propDown = this.add(new HomieProperty(this, {
            id: 'down',
            name: 'Scroll shutter down',
            datatype: HOMIE_TYPE_BOOL,
            retained: false,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        if (this.propConfig.canStop) {
            this.propStop = this.add(new HomieProperty(this, {
                id: 'stop',
                name: 'Stop shutter movement',
                datatype: HOMIE_TYPE_BOOL,
                retained: false,
                settable: this.propConfig.settable === true,
            }, getPropertyOptions(propConfig)));
        }

    }
}