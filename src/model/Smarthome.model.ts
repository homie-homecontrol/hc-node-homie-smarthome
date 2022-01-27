import { HomiePropertyAtrributes, HomiePropertyOptions } from "node-homie/model";
import { BaseSmarthomeNode } from "..";


export const H_SMARTHOME_NS_V1 = "homie-homecontrol/v1" as const;;

export type SetableProps<PROPIDS extends string> = {
    [index in PROPIDS]?: boolean;
}

export interface SetableNodePropertyConfig<PROPIDS extends string> {
    settable?: boolean | SetableProps<PROPIDS>;
}

export interface PropertyOptsNodePropertyConfig {
    propertyOpts?: HomiePropertyOptions;
}

export interface BaseNodePropertyConfig<PROPIDS extends string> extends SetableNodePropertyConfig<PROPIDS>, PropertyOptsNodePropertyConfig {

}

export interface SmarthomePropAttrs<IDS extends string> extends HomiePropertyAtrributes {
    id: IDS;
}

export type GetPropIDType<T> = T extends BaseNodePropertyConfig<infer PROPIDS> ? PROPIDS : string;

// ============================================================================================

export const H_SMARTHOME_TYPE_BATTERY = `${H_SMARTHOME_NS_V1}/type=battery` as const;

export const H_SMARTHOME_TYPE_BATTERY_PROPS = ['low-battery', 'battery-level'] as const;
export type SmarthomeTypeBatteryProps = typeof H_SMARTHOME_TYPE_BATTERY_PROPS[number];

export type BatteryNodePropertyConfig = BaseNodePropertyConfig<SmarthomeTypeBatteryProps> &
    ({
        lowBattery: true;
        batteryLevel: false;
    } | {
        lowBattery: false;
        batteryLevel: true;
    } | {
        lowBattery: true;
        batteryLevel: true;
    });


// ============================================================================================

export const H_SMARTHOME_TYPE_BUTTON = `${H_SMARTHOME_NS_V1}/type=button` as const;

export const H_SMARTHOME_TYPE_BUTTON_PROPS = ['action'] as const;
export type SmarthomeTypeButtonProps = typeof H_SMARTHOME_TYPE_BUTTON_PROPS[number];


export type ButtonState = 'press' | 'long-press' | 'double-press' | 'release' | 'long-release' | 'continuous';

export interface ButtonNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeButtonProps> {
    buttonStates: ButtonState[];
}

// ============================================================================================

export const H_SMARTHOME_TYPE_COLORLIGHT = `${H_SMARTHOME_NS_V1}/type=colorlight` as const;

export const H_SMARTHOME_TYPE_COLORLIGHT_PROPS = ['color', 'color-temperature'] as const;
export type SmarthomeTypeColorLightProps = typeof H_SMARTHOME_TYPE_COLORLIGHT_PROPS[number];

export interface ColorLightNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeColorLightProps> {
    ctmin: number;
    ctmax: number;
    colorMode?: 'rgb' | 'hsv';

}

// ============================================================================================


export const H_SMARTHOME_TYPE_CONTACT = `${H_SMARTHOME_NS_V1}/type=contact` as const;

export const H_SMARTHOME_TYPE_CONTACT_PROPS = ['state'] as const;
export type SmarthomeTypeContactProps = typeof H_SMARTHOME_TYPE_CONTACT_PROPS[number];

export interface ContactNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeContactProps> {

}

// ============================================================================================



export const H_SMARTHOME_TYPE_DIMMER = `${H_SMARTHOME_NS_V1}/type=dimmer` as const;

export const H_SMARTHOME_TYPE_DIMMER_PROPS = ['brightness', 'action'] as const;
export type SmarthomeTypeDimmerProps = typeof H_SMARTHOME_TYPE_DIMMER_PROPS[number];

export interface DimmerNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeDimmerProps> {
    step: number;
    stepToZero: boolean;
}



// ============================================================================================



export const H_SMARTHOME_TYPE_SHUTTER = `${H_SMARTHOME_NS_V1}/type=shutter` as const;

export const H_SMARTHOME_TYPE_SHUTTER_PROPS = ['position', 'action'] as const;
export type SmarthomeTypeShutterProps = typeof H_SMARTHOME_TYPE_SHUTTER_PROPS[number];

export interface ShutterNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeShutterProps> {
    canStop: boolean;
    implementUpDown: boolean;
}

// ============================================================================================



export const H_SMARTHOME_TYPE_MAINTENANCE = `${H_SMARTHOME_NS_V1}/type=maintenance` as const;

export const H_SMARTHOME_TYPE_MAINTENANCE_PROPS = ['low-battery', 'battery-level', 'last-update', 'reachable'] as const;
export type SmarthomeTypeMaintenanceProps = typeof H_SMARTHOME_TYPE_MAINTENANCE_PROPS[number];

export interface MaintenanceNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeMaintenanceProps> {
    lowBattery: boolean;
    batteryLevel: boolean;
    reachable: boolean;
    lastUpdate: boolean;
}



// ============================================================================================


export const H_SMARTHOME_TYPE_MOTION_SENSOR = `${H_SMARTHOME_NS_V1}/type=motionsensor` as const;

export const H_SMARTHOME_TYPE_MOTION_PROPS = ['motion', 'no-motion', 'lux'] as const;
export type SmarthomeTypeMotionProps = typeof H_SMARTHOME_TYPE_MOTION_PROPS[number];

export interface MotionSensorhNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeMotionProps> {
    lux: boolean;
    noMotion: boolean;
    noMotionIntervals: number[];
}

export const DefaultNoMotionIntervals = [30, 60, 120, 180, 300];





// ============================================================================================

export const H_SMARTHOME_TYPE_POWERMETER = `${H_SMARTHOME_NS_V1}/type=powermeter` as const;

export const H_SMARTHOME_TYPE_POWERMETER_PROPS = ['current', 'energy-counter', 'frequency', 'power', 'voltage'] as const;
export type SmarthomeTypePowermeterProps = typeof H_SMARTHOME_TYPE_POWERMETER_PROPS[number];

export interface PowermeterNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypePowermeterProps> {
    current: boolean;
    frequency: boolean;
    power: boolean;
    voltage: boolean;
    energy_counter: boolean;
}




// ============================================================================================

export const H_SMARTHOME_TYPE_SWITCH = `${H_SMARTHOME_NS_V1}/type=switch` as const;

export const H_SMARTHOME_TYPE_SWITCH_PROPS = ['state', 'action'] as const;
export type SmarthomeTypeSwitchProps = typeof H_SMARTHOME_TYPE_SWITCH_PROPS[number];

export interface SwitchNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeSwitchProps> {
}





// ============================================================================================

export const H_SMARTHOME_TYPE_THERMOSTAT = `${H_SMARTHOME_NS_V1}/type=thermostat` as const;

export const H_SMARTHOME_TYPE_THERMOSTAT_PROPS = ['set-temperature', 'valve', 'mode', 'windowopen', 'boost-state'] as const;
export type SmarthomeTypeThermostatProps = typeof H_SMARTHOME_TYPE_THERMOSTAT_PROPS[number];

export type ThermostatMode = 'off' | 'auto' | 'manual' | 'party' | 'boost' | 'cool' | 'heat' | 'emergency-heating' | 'precooling' | 'fan-only' | 'dry' | 'sleep';
export interface ThermostatNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeThermostatProps> {
    tempUnit: "C" | "F";
    valve: boolean;
    windowopen: boolean;
    boost_state: boolean;
    mode: boolean;
    modes: ThermostatMode[];
}




// ============================================================================================

export const H_SMARTHOME_TYPE_TILT_SENSOR = `${H_SMARTHOME_NS_V1}/type=tiltsensor` as const;

export const H_SMARTHOME_TYPE_TILT_PROPS = ['state'] as const;
export type SmarthomeTypeTiltProps = typeof H_SMARTHOME_TYPE_TILT_PROPS[number];

export interface TiltSensorNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeTiltProps> {

}




// ============================================================================================

export const H_SMARTHOME_TYPE_WEATHER = `${H_SMARTHOME_NS_V1}/type=weather` as const;

export const H_SMARTHOME_TYPE_WEATHER_PROPS = ['temperature', 'humidity', 'pressure'] as const;
export type SmarthomeTypeWeatherProps = typeof H_SMARTHOME_TYPE_WEATHER_PROPS[number];

export interface WeatherhNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeWeatherProps> {
    temperature: boolean;
    tempUnit: "C" | "F";
    humidity: boolean;
    pressure: boolean;
}




// ============================================================================================

export const H_SMARTHOME_TYPE_TEXT = `${H_SMARTHOME_NS_V1}/type=text` as const;

export const H_SMARTHOME_TYPE_TEXT_PROPS = ['text'] as const;
export type SmarthomeTypeTextProps = typeof H_SMARTHOME_TYPE_TEXT_PROPS[number];

export interface TextNodePropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeTextProps> {
}


// ============================================================================================

export const H_SMARTHOME_TYPE_MEDIAPLAYER = `${H_SMARTHOME_NS_V1}/type=mediaplayer` as const;

export const H_SMARTHOME_TYPE_MEDIAPLAYER_PROPS = ['player-action', 'position', 'volume', 'media-url', 'play-state', 'mute', 'shuffle', 'repeat', 'title', 'artist', 'album', 'duration'] as const;
export type SmarthomeTypeMediaplayerProps = typeof H_SMARTHOME_TYPE_MEDIAPLAYER_PROPS[number];


export const PlayerActions = ['next', 'previous', 'forward', 'rewind', 'play', 'pause', 'stop'];

export interface MediaplayerPropertyConfig extends BaseNodePropertyConfig<SmarthomeTypeMediaplayerProps> {
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

export const H_SMARTHOME_TYPE_EXTENSTION = `${H_SMARTHOME_NS_V1}/extension/type` as const;

// ============================================================================================


export const SmarthomeTypes = [H_SMARTHOME_TYPE_BATTERY, H_SMARTHOME_TYPE_SWITCH, H_SMARTHOME_TYPE_CONTACT, H_SMARTHOME_TYPE_WEATHER,
    H_SMARTHOME_TYPE_BUTTON, H_SMARTHOME_TYPE_TILT_SENSOR, H_SMARTHOME_TYPE_MOTION_SENSOR, H_SMARTHOME_TYPE_THERMOSTAT, H_SMARTHOME_TYPE_MEDIAPLAYER,
    H_SMARTHOME_TYPE_POWERMETER, H_SMARTHOME_TYPE_MAINTENANCE, H_SMARTHOME_TYPE_DIMMER, H_SMARTHOME_TYPE_SHUTTER, H_SMARTHOME_TYPE_COLORLIGHT, H_SMARTHOME_TYPE_TEXT] as const;


export type SmarthomeType = typeof SmarthomeTypes[number];

export type SmarthomeNodePropConfig = BatteryNodePropertyConfig | SwitchNodePropertyConfig | ContactNodePropertyConfig |
    WeatherhNodePropertyConfig | ButtonNodePropertyConfig | TiltSensorNodePropertyConfig | MotionSensorhNodePropertyConfig | MediaplayerPropertyConfig |
    ThermostatNodePropertyConfig | PowermeterNodePropertyConfig | MaintenanceNodePropertyConfig | DimmerNodePropertyConfig | ShutterNodePropertyConfig |
    ColorLightNodePropertyConfig | TextNodePropertyConfig;