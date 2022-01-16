import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_FLOAT, HOMIE_TYPE_INT,HomieNodeAtrributes } from "node-homie/model";
import { WeatherhNodePropertyConfig, H_SMARTHOME_TYPE_WEATHER } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: WeatherhNodePropertyConfig = { temperature: true, humidity: true, pressure: false, tempUnit: "C" , settable: false }



export class WeatherNode extends BaseSmarthomeNode<WeatherhNodePropertyConfig> {

    public readonly propTemperature?: HomieProperty;
    public readonly propHumidity?: HomieProperty;
    public readonly propPressure?: HomieProperty;



    public set temperature(value: number) {
        if (!this.propConfig.temperature) { return; }
        this.propTemperature!.value = String(value);

    }
    public get temperature(): number {
        if (!this.propConfig.temperature) { return 0; }
        return this.propTemperature!.value ? parseFloat(this.propTemperature!.value) : 0
    }

    public set humidity(value: number) {
        if (!this.propConfig.humidity) { return; }
        this.propHumidity!.value = String(value);

    }
    public get humidity(): number {
        if (!this.propConfig.humidity) { return 0; }
        return this.propHumidity!.value ? parseInt(this.propHumidity!.value, 10) : 0
    }

    public set pressure(value: number) {
        if (!this.propConfig.pressure) { return; }
        this.propPressure!.value = String(value);

    }
    public get pressure(): number {
        if (!this.propConfig.pressure) { return 0; }
        return this.propPressure!.value ? parseFloat(this.propPressure!.value): 0
    }


    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: WeatherhNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'weather',
                name: 'Weather clima sensor',
                type: H_SMARTHOME_TYPE_WEATHER
            },
            ...attrs
        },
        { ...DEFAULT_OPTIONS, ...propConfig });

        if (this.propConfig.temperature) {
            this.propTemperature = this.add(new HomieProperty(this, {
                id: 'temperature',
                name: 'Current temperature',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: this.propConfig.settable === true,
                unit: `°${this.propConfig.tempUnit}`
            }, getPropertyOptions(propConfig)));
        }
        if (this.propConfig.humidity) {
            this.propHumidity = this.add(new HomieProperty(this, {
                id: 'humidity',
                name: 'Current humidity',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: this.propConfig.settable === true,
                unit: "%"
            }, getPropertyOptions(propConfig)));
        }
        if (this.propConfig.pressure) {
            this.propPressure = this.add(new HomieProperty(this, {
                id: 'pressure',
                name: 'Current pressure',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: this.propConfig.settable === true,
                unit: "kPa"
            }, getPropertyOptions(propConfig)));
        }
    }




}