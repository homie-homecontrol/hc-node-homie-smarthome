import { map } from "rxjs/operators";
import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_FLOAT, NodeAttributes } from "node-homie/model";
import { PowermeterNodePropertyConfig, H_SMARTHOME_TYPE_POWERMETER } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: PowermeterNodePropertyConfig = { current: true, energy_counter: true, frequency: true, power: true, voltage: true, settable: false }

export class PowermeterNode extends BaseSmarthomeNode<PowermeterNodePropertyConfig> {

    public readonly propCurrent?: HomieProperty;
    public set current(value: number) {
        if (!this.propConfig.current) { return; }
        this.propCurrent!.value = String(value);
    }
    public get current(): number {
        if (!this.propConfig.current) { return 0; }
        return this.propCurrent!.value ? parseFloat(this.propCurrent!.value) : 0;
    }

    public readonly propEnergyCounter?: HomieProperty;
    public set energy_counter(value: number) {
        if (!this.propConfig.energy_counter) { return; }
        this.propEnergyCounter!.value = String(value);
    }
    public get energy_counter(): number {
        if (!this.propConfig.energy_counter) { return 0; }
        return this.propEnergyCounter!.value ? parseFloat(this.propEnergyCounter!.value) : 0;
    }

    public readonly propFrequency?: HomieProperty;
    public set frequency(value: number) {
        if (!this.propConfig.frequency) { return; }
        this.propFrequency!.value = String(value);
    }
    public get frequency(): number {
        if (!this.propConfig.frequency) { return 0; }
        return this.propFrequency!.value ? parseFloat(this.propFrequency!.value) : 0;
    }

    public readonly propPower?: HomieProperty;
    public set power(value: number) {
        if (!this.propConfig.power) { return; }
        this.propPower!.value = String(value);
    }
    public get power(): number {
        if (!this.propConfig.power) { return 0; }
        return this.propPower!.value ?  parseFloat(this.propPower!.value) : 0;
    }


    public readonly propVoltage?: HomieProperty;
    public set voltage(value: number) {
        if (!this.propConfig.voltage) { return; }
        this.propVoltage!.value = String(value);
    }
    public get voltage(): number {
        if (!this.propConfig.voltage) { return 0; }
        return this.propVoltage!.value ? parseFloat(this.propVoltage!.value) : 0;
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: PowermeterNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'powermeter',
                name: 'Powermeter',
                type: H_SMARTHOME_TYPE_POWERMETER
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        if (propConfig.current) {
            this.propCurrent = this.makeProperty({
                id: 'current',
                name: 'Current',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: false,
                unit: `mA`
            });
        }

        if (propConfig.energy_counter) {
            this.propEnergyCounter = this.makeProperty( {
                id: 'energy-counter',
                name: 'Energy counter',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: false,
                unit: `Wh`
            });
        }
        if (propConfig.frequency) {
            this.propFrequency = this.makeProperty( {
                id: 'frequency',
                name: 'Frequency',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: false,
                unit: `Hz`
            });
        }
        if (propConfig.power) {
            this.propPower = this.makeProperty( {
                id: 'power',
                name: 'Power',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: false,
                unit: `W`
            });
        }
        if (propConfig.voltage) {
            this.propVoltage = this.makeProperty({
                id: 'voltage',
                name: 'Voltage',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: false,
                unit: `V`
            });
        }


    }


}