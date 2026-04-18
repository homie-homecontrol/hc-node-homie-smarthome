# hc-node-homie-smarthome

[![works with MQTT Homie](https://homieiot.github.io/img/works-with-homie.png)](https://homieiot.github.io/)

Base library for homie homecontrol based on [node-homie](https://github.com/homie-homecontrol/node-homie). This lib defines a set of standard smarthome nodes like switch, level, climate sensor, etc.
Using these minimalistic defaults applications can take 'assumptions' about the purpose of the properties used in these nodes.

Each node can be configured and properties can be fine-tuned to specific needs.

The following nodes are defined:

- Switch
- Contact
- Climate (temperature, humidity, pressure)
- Button
- Tilt
- Motion
- Thermostat
- Mediaplayer
- Powermeter
- Level (dimmer/brightness)
- Color (color light with color temperature)
- Shutter
- Text
- Battery
- Maintenance

# Installation

```bash
# npm
npm install hc-node-homie-smarthome

# yarn
yarn add hc-node-homie-smarthome
```

# Usage

This library offers a set of `HomieNode`s which can either be subclassed or used directly in a `HomieDevice` to provide standardized behaviour and structure.

Benefits of this library are:

- properties do not have to be defined manually - faster implementation
- node offers convenience accessors to property values with TypeScript types
- all nodes follow a defined standard, so results are all comparable

Below you find a usage example with a theoretical hardware sensor api implementing a homie device with a climate node.

```typescript
import { ClimateNode } from "hc-node-homie-smarthome";

// example hardware temperature and humidity sensor
const tempHumSensor = getHardwareSensorAPI();

// Homie device
const device = new HomieDevice({ id: "my-climate-sensor", name: "My climate sensor" }, mqttOpts);

// add a smarthome climate node
const node = device.add(new ClimateNode(device));

// Set current state
node.temperature = tempHumSensor.getCurrentTemp();
node.humidity = tempHumSensor.getCurrentHum();

// Subscribe to the sensors dataUpdates (in this example it is an Observable emitting messages)
tempHumSensor.dataUpdates$.pipe(takeUntil(node.onDestroy$)).subscribe({
    next: (message) => {
        if (message.type === "temp") {
            node.temperature = message.value;
        }

        if (message.type === "hum") {
            node.humidity = message.value;
        }
    },
    error: (err) => {
        log.error(`Error process api message for [${node.pointer}].`, { error: err });
    },
});
```

# Node documentation

The following sections describe the available nodes and their specifics.

## Smarthome Namespace

All node types use the `hc-smarthome/v2/cap/{name}` namespace format. This is the v2 namespace used with Homie 5.0.

## Switch

`type`: `hc-smarthome/v2/cap/switch`

_Example usages_: Represent a switchable actor, e.g. wall socket plug, light bulb.

### Properties

| id     | type      | settable (default) | retained | unit | format   | comment                    |
| ------ | --------- | ------------------ | -------- | ---- | -------- | -------------------------- |
| state  | `boolean` | yes                | yes      | -    | -        | `true` = ON, `false` = OFF |
| action | `enum`    | yes                | no       | -    | `toggle` |

### Configuration

- common config options available

## Contact

`type`: `hc-smarthome/v2/cap/contact`

_Example usages_: Represent a open/close sensor, e.g. window or door contact.

### Properties

| id    | type      | settable (default) | retained | unit | format | comment                         |
| ----- | --------- | ------------------ | -------- | ---- | ------ | ------------------------------- |
| state | `boolean` | yes                | yes      | -    | -      | `true` = OPEN, `false` = CLOSED |

### Configuration

- common config options available

## Climate

`type`: `hc-smarthome/v2/cap/climate`

_Example usages_: Represent a weather/climate or humidity sensor.

### Properties

| id          | type    | settable (default) | retained | unit (default) | format | comment |
| ----------- | ------- | ------------------ | -------- | -------------- | ------ | ------- |
| temperature | `float` | no                 | yes      | °C             | -      |
| humidity    | `float` | no                 | yes      | %              | -      |
| pressure    | `float` | no                 | yes      | kPa            | -      |

### Specifics

By default the climate node is read only.

### Configuration

- common config options available
- `tempUnit` can be either "C" or "F" to configure the temperature unit (default: "C")
- all 3 properties are optional and can be configured with `boolean` flags whether they should be present or not:
    - `temperature`
    - `humidity`
    - `pressure`

```typescript
export interface ClimateNodePropertyConfig extends BaseNodePropertyConfig {
    temperature: boolean;
    tempUnit: "C" | "F";
    humidity: boolean;
    pressure: boolean;
}
```

## Button

`type`: `hc-smarthome/v2/cap/button`

_Example usages_: Represent a sender with a button, e.g. wall light switch.

### Properties

| id     | type   | settable (default) | retained | unit (default) | format (default)     | comment |
| ------ | ------ | ------------------ | -------- | -------------- | -------------------- | ------- |
| action | `enum` | no                 | no       | -              | `press`,`long-press` |

### Specifics

Supports 6 different button actions:

- press
- long-press
- double-press
- release
- long-release
- continuous

### Configuration

- common config options available
- `buttonStates`: an array of actions, valid values see above

```typescript
export type ButtonState = "press" | "long-press" | "double-press" | "release" | "long-release" | "continuous";

export interface ButtonNodePropertyConfig extends BaseNodePropertyConfig {
    buttonStates: ButtonState[];
}
```

## Tilt

`type`: `hc-smarthome/v2/cap/tilt`

_Example usages_: Represent a tilt sensor on a box lid or tiltable window.

### Properties

| id    | type      | settable (default) | retained | unit | format | comment                          |
| ----- | --------- | ------------------ | -------- | ---- | ------ | -------------------------------- |
| state | `boolean` | yes                | yes      | -    | -      | `true` = TILTED, `false` = LEVEL |

### Configuration

- common config options available

## Motion

`type`: `hc-smarthome/v2/cap/motion`

_Example usages_: Represent a PIR motion sensor.

### Properties

| id        | type      | settable (default) | retained | unit (default) | format | comment                                |
| --------- | --------- | ------------------ | -------- | -------------- | ------ | -------------------------------------- |
| motion    | `boolean` | false              | yes      | -              | -      | `true` = MOTION, `false` = NO MOTION   |
| no-motion | `integer` | false              | yes      | s              | -      | Seconds since last motion was detected |
| lux       | `integer` | false              | yes      | lx             | -      | Current light intensity in lux         |

### Specifics

Properties `no-motion` and `lux` are optional.
The `no-motion` property is designed to emit in time intervals (e.g. 30, 60, 120 seconds). Updating continuously every second would spam the message bus. Therefore as configuration option you can only specify an array of time intervals.

### Configuration

- common config options available
- Properties `no-motion` and `lux` are optional and can be configured with `boolean` flags whether they should be present or not:
    - `noMotion`
    - `lux`
- `noMotionIntervals` an array of time intervals after which an update is sent when no motion was detected

```typescript
export interface MotionNodePropertyConfig extends BaseNodePropertyConfig {
    lux: boolean;
    noMotion: boolean;
    noMotionIntervals: number[];
}

export const DefaultNoMotionIntervals = [30, 60, 120, 180, 300];
```

## Thermostat

`type`: `hc-smarthome/v2/cap/thermostat`

### Properties

| id              | type      | settable (default) | retained | unit (default) | format                        | comment                         |
| --------------- | --------- | ------------------ | -------- | -------------- | ----------------------------- | ------------------------------- |
| set-temperature | `float`   | yes                | yes      | °C             | -                             | Target temperature              |
| valve           | `integer` | no                 | yes      | %              | 0:100                         | Valve position                  |
| mode            | `enum`    | yes                | yes      | -              | `auto`,`manual`,`boost`,`off` | Operating mode                  |
| windowopen      | `boolean` | no                 | yes      | -              | -                             | Window-open detection           |
| boost-state     | `integer` | no                 | yes      | s              | -                             | Remaining boost time in seconds |

### Configuration

- common config options available

## Mediaplayer

`type`: `hc-smarthome/v2/cap/mediaplayer`

### Properties

| id             | type      | settable (default) | retained | unit | format                                  | comment                   |
| -------------- | --------- | ------------------ | -------- | ---- | --------------------------------------- | ------------------------- |
| player-action  | `enum`    | yes                | no       | -    | `play`,`pause`,`stop`,`next`,`previous` |
| media-progress | `integer` | no                 | yes      | s    | -                                       | Current playback position |
| media-length   | `integer` | no                 | yes      | s    | -                                       | Total media duration      |
| volume         | `integer` | yes                | yes      | %    | 0:100                                   | Volume level              |
| art-url        | `string`  | no                 | yes      | -    | -                                       | Album art URL             |
| play-state     | `enum`    | no                 | yes      | -    | `playing`,`paused`,`stopped`,`idle`     |
| mute           | `boolean` | yes                | yes      | -    | -                                       | Mute state                |
| shuffle        | `boolean` | yes                | yes      | -    | -                                       | Shuffle mode              |
| repeat         | `enum`    | yes                | yes      | -    | `none`,`one`,`all`                      | Repeat mode               |
| title          | `string`  | no                 | yes      | -    | -                                       | Current track title       |
| subtext1       | `string`  | no                 | yes      | -    | -                                       | Artist/subtitle           |
| subtext2       | `string`  | no                 | yes      | -    | -                                       | Album/additional text     |

### Configuration

- common config options available

## Powermeter

`type`: `hc-smarthome/v2/cap/powermeter`

### Properties

| id             | type    | settable (default) | retained | unit (default) | format | comment                   |
| -------------- | ------- | ------------------ | -------- | -------------- | ------ | ------------------------- |
| current        | `float` | no                 | yes      | A              | -      | Current in amperes        |
| energy-counter | `float` | no                 | yes      | kWh            | -      | Cumulative energy counter |
| frequency      | `float` | no                 | yes      | Hz             | -      | Line frequency            |
| power          | `float` | no                 | yes      | W              | -      | Current power consumption |
| voltage        | `float` | no                 | yes      | V              | -      | Line voltage              |

### Configuration

- common config options available

## Level

`type`: `hc-smarthome/v2/cap/level`

_Example usages_: Represent a dimmable light or brightness control.

### Properties

| id         | type      | settable (default) | retained | unit | format   | comment          |
| ---------- | --------- | ------------------ | -------- | ---- | -------- | ---------------- |
| brightness | `integer` | yes                | yes      | %    | 0:100    | Brightness level |
| action     | `enum`    | yes                | no       | -    | `toggle` |

### Configuration

- common config options available

## Shutter

`type`: `hc-smarthome/v2/cap/shutter`

_Example usages_: Represent a roller shutter or blind.

### Properties

| id       | type      | settable (default) | retained | unit | format | comment                               |
| -------- | --------- | ------------------ | -------- | ---- | ------ | ------------------------------------- |
| position | `integer` | yes                | yes      | %    | 0:100  | Shutter position (0=closed, 100=open) |
| action   | `enum`    | yes                | no       | -    | `stop` |

### Configuration

- common config options available

## Color

`type`: `hc-smarthome/v2/cap/color`

_Example usages_: Represent a color-capable light with color temperature support.

### Properties

| id                | type      | settable (default) | retained | unit | format | comment                    |
| ----------------- | --------- | ------------------ | -------- | ---- | ------ | -------------------------- |
| color             | `color`   | yes                | yes      | -    | `hsv`  | HSV color value            |
| color-temperature | `integer` | yes                | yes      | MK⁻¹ | -      | Color temperature in mired |

### Configuration

- common config options available

## Text

`type`: `hc-smarthome/v2/cap/text`

_Example usages_: Represent a text display or text input field.

### Properties

| id   | type     | settable (default) | retained | unit | format | comment      |
| ---- | -------- | ------------------ | -------- | ---- | ------ | ------------ |
| text | `string` | yes                | yes      | -    | -      | Text content |

### Configuration

- common config options available

## Battery

`type`: `hc-smarthome/v2/cap/battery`

_Example usages_: Represent the battery state of a battery-powered device.

### Properties

| id            | type      | settable (default) | retained | unit | format | comment              |
| ------------- | --------- | ------------------ | -------- | ---- | ------ | -------------------- |
| low-battery   | `boolean` | no                 | yes      | -    | -      | `true` = battery low |
| battery-level | `integer` | no                 | yes      | %    | 0:100  | Battery charge level |

### Configuration

- common config options available

## Maintenance

`type`: `hc-smarthome/v2/cap/maintenance`

_Example usages_: Represent maintenance/operational status of a device.

### Properties

| id            | type       | settable (default) | retained | unit | format | comment                   |
| ------------- | ---------- | ------------------ | -------- | ---- | ------ | ------------------------- |
| low-battery   | `boolean`  | no                 | yes      | -    | -      | `true` = battery low      |
| battery-level | `integer`  | no                 | yes      | %    | 0:100  | Battery charge level      |
| last-update   | `datetime` | no                 | yes      | -    | -      | Last update timestamp     |
| reachable     | `boolean`  | no                 | yes      | -    | -      | `true` = device reachable |

### Configuration

- common config options available

## Common configuration options

Each node has the following common configuration options:

`settable`:

Configures if all or specific properties should be settable.
Can be either a boolean or an object of booleans with property IDs for which the settable option is specified.

Example:

```typescript
// All properties should be settable
const config_all = {
    settable: true,
};

// only action property should be settable
const config_specific = {
    settable: {
        state: false,
        action: true,
    },
};
```

`propertyOpts`:

Provides property options for the homie-properties see [node-homie](https://github.com/schaze/node-homie#readme).

Example:

```typescript
// do not attempt to read previous property state from mqtt
const config = {
    propertyOpts: {
        readValueFromMqtt: false,
        readTimeout: 0,
    },
};
```

# Breaking changes (v4 → v5)

# <<<<<<< HEAD

Please also note that this library does not yet fully implement the v2 homecontrol smarthome spec. Updates will follow.

## Namespace

- v1: `homie-homecontrol/v1/type={name}`
- v2: `hc-smarthome/v2/cap/{name}`

## Class renames

| Old Class          | New Class     | Old Constant                     | New Constant               |
| ------------------ | ------------- | -------------------------------- | -------------------------- |
| `DimmerNode`       | `LevelNode`   | `H_SMARTHOME_TYPE_DIMMER`        | `H_SMARTHOME_TYPE_LEVEL`   |
| `ColorLightNode`   | `ColorNode`   | `H_SMARTHOME_TYPE_COLORLIGHT`    | `H_SMARTHOME_TYPE_COLOR`   |
| `WeatherNode`      | `ClimateNode` | `H_SMARTHOME_TYPE_WEATHER`       | `H_SMARTHOME_TYPE_CLIMATE` |
| `MotionSensorNode` | `MotionNode`  | `H_SMARTHOME_TYPE_MOTION_SENSOR` | `H_SMARTHOME_TYPE_MOTION`  |
| `TiltSensorNode`   | `TiltNode`    | `H_SMARTHOME_TYPE_TILT_SENSOR`   | `H_SMARTHOME_TYPE_TILT`    |

## Type string renames

| Old Type String                          | New Type String                   |
| ---------------------------------------- | --------------------------------- |
| `homie-homecontrol/v1/type=dimmer`       | `hc-smarthome/v2/cap/level`       |
| `homie-homecontrol/v1/type=colorlight`   | `hc-smarthome/v2/cap/color`       |
| `homie-homecontrol/v1/type=weather`      | `hc-smarthome/v2/cap/climate`     |
| `homie-homecontrol/v1/type=motionsensor` | `hc-smarthome/v2/cap/motion`      |
| `homie-homecontrol/v1/type=tiltsensor`   | `hc-smarthome/v2/cap/tilt`        |
| `homie-homecontrol/v1/type=switch`       | `hc-smarthome/v2/cap/switch`      |
| `homie-homecontrol/v1/type=contact`      | `hc-smarthome/v2/cap/contact`     |
| `homie-homecontrol/v1/type=button`       | `hc-smarthome/v2/cap/button`      |
| `homie-homecontrol/v1/type=thermostat`   | `hc-smarthome/v2/cap/thermostat`  |
| `homie-homecontrol/v1/type=battery`      | `hc-smarthome/v2/cap/battery`     |
| `homie-homecontrol/v1/type=shutter`      | `hc-smarthome/v2/cap/shutter`     |
| `homie-homecontrol/v1/type=powermeter`   | `hc-smarthome/v2/cap/powermeter`  |
| `homie-homecontrol/v1/type=maintenance`  | `hc-smarthome/v2/cap/maintenance` |
| `homie-homecontrol/v1/type=mediaplayer`  | `hc-smarthome/v2/cap/mediaplayer` |
| `homie-homecontrol/v1/type=text`         | `hc-smarthome/v2/cap/text`        |

## Config interface renames

| Old Interface                    | New Interface               |
| -------------------------------- | --------------------------- |
| `WeatherNodePropertyConfig`      | `ClimateNodePropertyConfig` |
| `MotionSensorNodePropertyConfig` | `MotionNodePropertyConfig`  |
| `DimmerNodePropertyConfig`       | `LevelNodePropertyConfig`   |
| `ColorLightNodePropertyConfig`   | `ColorNodePropertyConfig`   |
| `TiltSensorNodePropertyConfig`   | `TiltNodePropertyConfig`    |
