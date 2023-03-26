import { H_SMARTHOME_TYPE_BATTERY, BatteryNodePropertyConfig, SmarthomePropAttrs, SmarthomeTypeBatteryProps } from "./model/Smarthome.model";
import { checkSettable, getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";
import { HomieDevice, HomieProperty } from "node-homie";
import { NodeAttributes, HOMIE_TYPE_BOOL, HOMIE_TYPE_INT } from "node-homie/model";

const DEFAULT_OPTIONS: BatteryNodePropertyConfig = { batteryLevel: true, lowBattery: true, settable: false }


export class BatteryNode extends BaseSmarthomeNode<BatteryNodePropertyConfig> {

    public readonly propLowBattery?: HomieProperty;
    public readonly propBatteryLevel?: HomieProperty;


    public set lowBattery(value: boolean) {
        if (!this.propConfig.lowBattery) { return; }
        this.propLowBattery!.value = String(value);

    }
    public get lowBattery(): boolean {
        if (!this.propConfig.lowBattery) { return false; }
        return this.propLowBattery!.value === 'true';
    }

    public set batteryLevel(value: number) {
        if (!this.propConfig.batteryLevel) { return; }
        this.propLowBattery!.value = String(value);
    }
    public get batteryLevel(): number {
        if (!this.propConfig.batteryLevel) { return 100; }
        return Number(this.propLowBattery!.value);
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: BatteryNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'battery',
                name: 'Battery information',
                type: H_SMARTHOME_TYPE_BATTERY
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        if (this.propConfig.lowBattery) {
            this.propLowBattery = this.makeProperty({
                id: 'low-battery',
                name: 'Low battery indicator',
                datatype: HOMIE_TYPE_BOOL,
                retained: true,
                settable: false
            });
        }
        if (this.propConfig.batteryLevel) {
            this.propBatteryLevel = this.makeProperty({
                id: 'battery-level',
                name: 'Battery level',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: false,
                unit: '%'
            });
        }
    }

}