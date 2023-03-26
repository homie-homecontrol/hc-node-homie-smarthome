import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_BOOL, HOMIE_TYPE_DATETIME, HOMIE_TYPE_INT, NodeAttributes } from "node-homie/model";
import { MaintenanceNodePropertyConfig, H_SMARTHOME_TYPE_MAINTENANCE } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: MaintenanceNodePropertyConfig = { batteryLevel: false, lowBattery: true, reachable: true, lastUpdate: true, settable: false }


export class MaintenanceNode extends BaseSmarthomeNode<MaintenanceNodePropertyConfig> {

    public readonly propLowBattery?: HomieProperty;
    public readonly propBatteryLevel?: HomieProperty;
    public readonly propReachable?: HomieProperty;
    public readonly propLastUpdate?: HomieProperty;


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
        this.propBatteryLevel!.value = String(value);
    }
    public get batteryLevel(): number {
        if (!this.propConfig.batteryLevel) { return 100; }
        return Number(this.propBatteryLevel!.value);
    }

    public set reachable(value: boolean) {
        if (!this.propConfig.reachable) { return; }
        this.propReachable!.value = String(value);

    }
    public get reachable(): boolean {
        if (!this.propConfig.reachable) { return true; }
        return this.propReachable!.value === 'true';
    }

    public set lastUpdate(value: Date) {
        if (!this.propConfig.lastUpdate) { return; }
        this.propLastUpdate!.value = value.toISOString();
    }
    public get lastUpdate(): Date {
        if (!this.propConfig.lastUpdate) { return new Date(0); }
        return new Date(this.propLastUpdate!.value || 0)
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: MaintenanceNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'maintenance',
                name: 'Maintenance information',
                type: H_SMARTHOME_TYPE_MAINTENANCE
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
                settable: false,
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
        if (this.propConfig.lastUpdate) {
            this.propLastUpdate = this.makeProperty({
                id: 'last-update',
                name: 'Datetime of last received update from device',
                datatype: HOMIE_TYPE_DATETIME,
                retained: true,
                settable: false,
            });
        }
        if (this.propConfig.reachable) {
            this.propReachable = this.makeProperty({
                id: 'reachable',
                name: 'Reachable',
                datatype: HOMIE_TYPE_BOOL,
                retained: true,
                settable: false,
            });
        }

    }

}