import { HomiePropertyOptions } from "node-homie/model";
import { PropertyOptsNodePropertyConfig, SetableProps } from "../model/Smarthome.model";

export function getPropertyOptions(config: PropertyOptsNodePropertyConfig): HomiePropertyOptions{
    return {
        readTimeout: config?.propertyOpts?.readTimeout,
        readValueFromMqtt: config?.propertyOpts?.readValueFromMqtt === true
    }
}

export function checkSettable(settable: boolean | SetableProps | undefined | null, attr: keyof SetableProps, defaultState: boolean = false): boolean {
    if (settable === undefined || settable === null || !Object.prototype.hasOwnProperty.call(settable, attr) ) { return defaultState; }
    if (settable === true || settable == false) { return settable; }
    return settable[attr];
}