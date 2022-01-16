import { HomiePropertyOptions } from "node-homie/model";


export const H_SMARTHOME_NS_V1 = "homie-homecontrol/v1" as const;;

export interface SetableProps {
    [index: string]: boolean;
}

export interface SetableNodePropertyConfig {
    settable?: boolean | SetableProps;
}

export interface PropertyOptsNodePropertyConfig {
    propertyOpts?: HomiePropertyOptions;
}

export interface BaseNodePropertyConfig extends SetableNodePropertyConfig, PropertyOptsNodePropertyConfig {
}

// ============================================================================================

export const H_SMARTHOME_TYPE_BATTERY = `${H_SMARTHOME_NS_V1}/type=battery` as const;

export interface BatteryNodePropertyConfig extends BaseNodePropertyConfig {
    lowBattery: boolean;
    batteryLevel: boolean;
}

// ============================================================================================

export const H_SMARTHOME_TYPE_BUTTON = `${H_SMARTHOME_NS_V1}/type=button` as const;

export type ButtonState = 'press' | 'long-press' | 'double-press' | 'release' | 'long-release' | 'continuous';

export interface ButtonNodePropertyConfig extends BaseNodePropertyConfig {
    buttonStates: ButtonState[];
}

// ============================================================================================

export const H_SMARTHOME_TYPE_COLORLIGHT = `${H_SMARTHOME_NS_V1}/type=colorlight` as const;

export interface ColorLightNodePropertyConfig extends BaseNodePropertyConfig {
    ctmin: number;
    ctmax: number;
    colorMode?: 'rgb' | 'hsv';

}

// ============================================================================================


export const H_SMARTHOME_TYPE_CONTACT = `${H_SMARTHOME_NS_V1}/type=contact` as const;

export interface ContactNodePropertyConfig extends BaseNodePropertyConfig {

}

// ============================================================================================



export const H_SMARTHOME_TYPE_DIMMER = `${H_SMARTHOME_NS_V1}/type=dimmer` as const;

export interface DimmerNodePropertyConfig extends BaseNodePropertyConfig {
    step: number;
    stepToZero: boolean;
}



// ============================================================================================



export const H_SMARTHOME_TYPE_SHUTTER = `${H_SMARTHOME_NS_V1}/type=shutter` as const;

export interface ShutterNodePropertyConfig extends BaseNodePropertyConfig {
    canStop: boolean;
}

// ============================================================================================



export const H_SMARTHOME_TYPE_MAINTENANCE = `${H_SMARTHOME_NS_V1}/type=maintenance` as const;

export interface MaintenanceNodePropertyConfig extends BaseNodePropertyConfig {
    lowBattery: boolean;
    batteryLevel: boolean;
    reachable: boolean;
    lastUpdate: boolean;
}



// ============================================================================================


export const H_SMARTHOME_TYPE_MOTION_SENSOR = `${H_SMARTHOME_NS_V1}/type=motionsensor` as const;

export interface MotionSensorhNodePropertyConfig extends BaseNodePropertyConfig {
    lux: boolean;
    noMotion: boolean;
    noMotionIntervals: number[];
}

export const DefaultNoMotionIntervals = [30, 60, 120, 180, 300];





// ============================================================================================

export const H_SMARTHOME_TYPE_POWERMETER = `${H_SMARTHOME_NS_V1}/type=powermeter` as const;

export interface PowermeterNodePropertyConfig extends BaseNodePropertyConfig {
    current: boolean;
    frequency: boolean;
    power: boolean;
    voltage: boolean;
    energy_counter: boolean;
}




// ============================================================================================

export const H_SMARTHOME_TYPE_SWITCH = `${H_SMARTHOME_NS_V1}/type=switch` as const;

export interface SwitchNodePropertyConfig extends BaseNodePropertyConfig {
}





// ============================================================================================

export const H_SMARTHOME_TYPE_THERMOSTAT = `${H_SMARTHOME_NS_V1}/type=thermostat` as const;

export type ThermostatMode = 'off' | 'auto' | 'manual' | 'party' | 'boost' | 'cool' | 'heat' | 'emergency-heating' | 'precooling' | 'fan-only' | 'dry' | 'sleep';
export interface ThermostatNodePropertyConfig extends BaseNodePropertyConfig {
    tempUnit: "C" | "F";
    valve: boolean;
    windowopen: boolean;
    boost_state: boolean;
    mode: boolean;
    modes: ThermostatMode[];
}




// ============================================================================================

export const H_SMARTHOME_TYPE_TILT_SENSOR = `${H_SMARTHOME_NS_V1}/type=tiltsensor` as const;

export interface TiltSensorNodePropertyConfig extends BaseNodePropertyConfig {

}




// ============================================================================================

export const H_SMARTHOME_TYPE_WEATHER = `${H_SMARTHOME_NS_V1}/type=weather` as const;

export interface WeatherhNodePropertyConfig extends BaseNodePropertyConfig {
    temperature: boolean;
    tempUnit: "C" | "F";
    humidity: boolean;
    pressure: boolean;

}

// ============================================================================================


export const H_SMARTHOME_TYPE_TEXT = `${H_SMARTHOME_NS_V1}/type=text` as const;

export interface TextNodePropertyConfig extends BaseNodePropertyConfig {
}


// ============================================================================================

export const H_SMARTHOME_TYPE_EXTENSTION = `${H_SMARTHOME_NS_V1}/extension/type` as const;

// ============================================================================================

export const H_SMARTHOME_TYPE_MEDIAPLAYER = `${H_SMARTHOME_NS_V1}/type=mediaplayer` as const;

export const PlayerActions = ['next', 'previous', 'forward', 'rewind', 'play', 'pause', 'stop'];

export interface MediaplayerPropertyConfig extends BaseNodePropertyConfig {
    next: boolean,
    previous: boolean,
    forward: boolean,
    rewind: boolean,
    stop: boolean,
    position: boolean,
    mediaUrl: boolean,
    volume: boolean,
    mute: boolean,
    shuffle: boolean,
    repeat: boolean,
    trackInfo: boolean
}


// ============================================================================================


export const SmarthomeTypes = [H_SMARTHOME_TYPE_BATTERY, H_SMARTHOME_TYPE_SWITCH, H_SMARTHOME_TYPE_CONTACT, H_SMARTHOME_TYPE_WEATHER,
    H_SMARTHOME_TYPE_BUTTON, H_SMARTHOME_TYPE_TILT_SENSOR, H_SMARTHOME_TYPE_MOTION_SENSOR, H_SMARTHOME_TYPE_THERMOSTAT, H_SMARTHOME_TYPE_MEDIAPLAYER,
    H_SMARTHOME_TYPE_POWERMETER, H_SMARTHOME_TYPE_MAINTENANCE, H_SMARTHOME_TYPE_DIMMER, H_SMARTHOME_TYPE_SHUTTER, H_SMARTHOME_TYPE_COLORLIGHT, H_SMARTHOME_TYPE_TEXT] as const;


export type SmarthomeType = typeof SmarthomeTypes[number];

export type SmarthomeNodePropConfig = BatteryNodePropertyConfig | SwitchNodePropertyConfig | ContactNodePropertyConfig |
    WeatherhNodePropertyConfig | ButtonNodePropertyConfig | TiltSensorNodePropertyConfig | MotionSensorhNodePropertyConfig | MediaplayerPropertyConfig |
    ThermostatNodePropertyConfig | PowermeterNodePropertyConfig | MaintenanceNodePropertyConfig | DimmerNodePropertyConfig | ShutterNodePropertyConfig |
    ColorLightNodePropertyConfig | TextNodePropertyConfig;