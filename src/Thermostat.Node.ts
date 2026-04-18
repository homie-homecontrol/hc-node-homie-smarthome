import { HomieDevice, HomieProperty } from "node-homie";
import { HOMIE_TYPE_BOOL, HOMIE_TYPE_ENUM, HOMIE_TYPE_FLOAT, HOMIE_TYPE_INT, NodeAttributes } from "node-homie/model";
import { ThermostatNodePropertyConfig, H_SMARTHOME_TYPE_THERMOSTAT, SetableProps } from "./model/Smarthome.model";
import { checkSettable, getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: ThermostatNodePropertyConfig = {
    boost_state: true, mode: true, modes: ['auto', 'manual'], windowopen: true, valve: true, tempUnit: 'C',
    settable: {
        'set-temperature': true,
        'valve': false,
        'mode': true,
        'windowopen': false,
        'boost-state': false
    }

}

export class ThermostatNode extends BaseSmarthomeNode<ThermostatNodePropertyConfig> {

    public readonly propSetTemperature: HomieProperty;
    public set setTemperature(value: number) {
        this.propSetTemperature.value = String(value);
    }
    public get setTemperature(): number {
        return this.propSetTemperature.value ? parseFloat(this.propSetTemperature.value) : 0;
    }

    public readonly propValve?: HomieProperty;
    public set valve(value: number) {
        if (!this.propConfig.valve) { return; }
        this.propValve!.value = String(value);
    }
    public get valve(): number {
        if (!this.propConfig.valve) { return 0; }
        return this.propValve!.value ? parseInt(this.propValve!.value, 10) : 0;
    }

    public readonly propMode?: HomieProperty;
    public set opMode(value: string) {
        if (!this.propConfig.mode) { return; }
        this.propMode!.value = value;
    }
    public get opMode(): string {
        if (!this.propConfig.mode) { return ''; }
        return this.propMode!.value ? this.propMode!.value : '';
    }

    public readonly propWindowopen?: HomieProperty;
    public set windowopen(value: boolean) {
        if (!this.propConfig.windowopen) { return; }
        this.propWindowopen!.value = String(value);

    }
    public get windowopen(): boolean {
        if (!this.propConfig.windowopen) { return false; }
        return this.propWindowopen!.value === 'true';
    }

    public readonly propBoostState?: HomieProperty;
    public set boostState(value: number) {
        if (!this.propConfig.boost_state) { return; }
        this.propBoostState!.value = String(value);
    }
    public get boostState(): number {
        if (!this.propConfig.boost_state) { return 0; }
        return this.propBoostState!.value ? parseInt(this.propBoostState!.value, 10) : 0;
    }


    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: ThermostatNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'thermostat',
                name: 'Thermostat',
                type: H_SMARTHOME_TYPE_THERMOSTAT
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propSetTemperature = this.makeProperty({
            id: 'set-temperature',
            name: 'Target temperature',
            datatype: HOMIE_TYPE_FLOAT,
            retained: true,
            settable: true,
            unit: `°${this.propConfig.tempUnit}`
        });


        if (this.propConfig.valve) {
            this.propValve =this.makeProperty({
                id: 'valve',
                name: 'Valve opening',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: false,
                unit: "%"
            });
        }

        if (this.propConfig.mode) {
            this.propMode = this.makeProperty({
                id: 'mode',
                name: 'Heating/Cooling mode',
                datatype: HOMIE_TYPE_ENUM,
                retained: true,
                settable: true,
                format: this.propConfig.modes.join(',')
            });
        }

        if (this.propConfig.windowopen) {
            this.propWindowopen = this.makeProperty( {
                id: 'windowopen',
                name: 'Window open state',
                datatype: HOMIE_TYPE_BOOL,
                retained: true,
                settable: false,
            })
        }

        if (this.propConfig.boost_state) {
            this.propBoostState = this.makeProperty( {
                id: 'boost-state',
                name: 'Seconds remain for boost',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: false,
                unit: "min"
            });
        }

    }




}