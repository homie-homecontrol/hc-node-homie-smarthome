import { HomiePropertyOptions } from "node-homie/model";
import { PropertyOptsNodePropertyConfig, SetableProps } from "../model/Smarthome.model";

export function getPropertyOptions(config: PropertyOptsNodePropertyConfig): HomiePropertyOptions{
    return {
        readTimeout: config?.propertyOpts?.readTimeout,
        readValueFromMqtt: config?.propertyOpts?.readValueFromMqtt === true
    }
}

export function checkSettable<PROPIDS extends string = string>(settable: boolean | SetableProps<PROPIDS> | undefined | null, attr: keyof SetableProps<PROPIDS>, defaultState: boolean = false): boolean {
    if (settable === true || settable === false) { return settable; }
    if (settable === undefined || settable === null || !Object.prototype.hasOwnProperty.call(settable, attr) ) { return defaultState; }
    return settable[attr]!;
}