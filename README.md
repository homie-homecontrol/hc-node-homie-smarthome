# hc-node-homie-smarthome

[![works with MQTT Homie](https://homieiot.github.io/img/works-with-homie.png)](https://homieiot.github.io/)


Base library for homie homecontrol based on [node-homie](https://github.com/schaze/node-homie). This lib defines a set of standard smarthome nodes like switch, dimmer, weather sensor,...
Using these minimalistic defaults applications can take 'assumptions' about the purpose of the properties used in these nodes. 

Each node can be configured and properties can be finetuned to specific needs.

The following nodes are defined:

* Switch
* Contact
* Weather
* Button
* Tiltsensor
* Motionsensor
* Thermostat
* Mediaplayer
* Powermeter
* Dimmer
* Colorlight
* Shutter
* Text
* Battery
* Maintenance

# Installation
```bash
# npm
npm install hc-node-homie-smarthome

# yarn
yarn add hc-node-homie-smarthome
```
# Usage
This library offers a set of `HomieNode`s which can either be subclassed or used directly in a `HomieDevice` to provide standardized behaviour and structure.


Benefits of this is library are:
* properties do not have to be defined manually - faster implementation
* node offers convinience accessors to property values with typescript types
* all nodes follow a defined standard, so results are all comparable

Below you find a usage example with a theoretical hardware sensor api implementing a homie device with a weather node.
```typescript

    import { WeatherNode } from "node-homie-smarthome";

    // example hardware temperature and humidity sensor
    const tempHumSensor = getHardwareSensorAPI();

    // Homie device
    const device = new HomieDevice({ id: 'my-weather-sensor', name: 'My weather sensor' }, mqttOpts);

    // add a smarthome weather node
    const node = device.add(new WeatherNode(device));

    // Set current state
    node.temperature = tempHumSensor.getCurrentTemp();
    node.humidity = tempHumSensor.getCurrentHum();

    // Subscribe to the sensors dataUpdates (in this example it is ab Observable emitting messages)
    tempHumSensor.dataUpdates$.pipe(takeUntil(node.onDestroy$)).subscribe(
        {
            next: message => {
                if (message.type === 'temp') {
                    node.temperature=message.value;
                }
        
                if (message.type === 'hum') {
                    node.humidity=message.value;
                }
            },
            error: (err) => {
                log.error(`Error process api message for [${node.pointer}].`, { error: err });
            }
        }
    )


```

# Node documenation
The following sections describe the available nodes and their specifics.
>Documentation is not yet completeted (sorry - I will work on it...) - however the code is pretty self explanatory.

## Switch
`type`: "homie-homecontrol/v1/type=switch"

*Example usages*: Represent a switchable actor, e.g. wall socket plug, light bulb.

### Properties

|id|type|settable (defualt)|retained|unit|format|comment
|-|-|-|-|-|-|-|
|state|`boolean`|yes|yes|-|-|`true` = ON, `false` = OFF
|action|`enum`|yes|no|-|`toggle`| 

### Configuration
* common config options available

## Contact
`type`: "homie-homecontrol/v1/type=contact"

*Example usages*: Represent a open/close sensor, e.g. window or door contact.

### Properties

|id|type|settable (defualt)|retained|unit|format|comment
|-|-|-|-|-|-|-|
|state|`boolean`|yes|yes|-|-|`true` = OPEN, `false` = CLOSED

### Configuration
* common config options available
## Weather
`type`: "homie-homecontrol/v1/type=weather"

*Example usages*: Represent a weather or humidity sensor.

### Properties

|id|type|settable (defualt)|retained|unit (default)|format|comment
|-|-|-|-|-|-|-|
|temperature|`float`|no|yes|°C|-|
|humidity|`float`|no|yes|%|-|
|pressure|`float`|no|yes|kPa|-|

### Specifics
By default the weather node is read only.

### Configuration
* common config options available
* `tempUnit` can be either "C" of "F" to configure the temperature unit (default: "C")
* all 3 properties are optional and can be configured with `boolean` flags whether they should be present or not:
  * `temperature`
  * `humidity`
  * `pressure`

```typescript
export interface WeatherhNodePropertyConfig extends BaseNodePropertyConfig {
    temperature: boolean;
    tempUnit: "C" | "F";
    humidity: boolean;
    pressure: boolean;

}
```

## Button
`type`: "homie-homecontrol/v1/type=button"

*Example usages*: Represent a sender with a button, e.g. wall light switch.

### Properties

|id|type|settable (defualt)|retained|unit (default)|format (default)|comment
|-|-|-|-|-|-|-|
|action|`enum`|no|no|-|`press`,`long-press`|


### Specifics
Homie-Homecontrol supports 6 different button actios:
* press 
* long-press 
* double-press 
* release 
* long-release 
* continuous
### Configuration
* common config options available
* `buttonStates`: an array of actions, valid values see above

```typescript
export type ButtonState = 'press' | 'long-press' | 'double-press' | 'release' | 'long-release' | 'continuous';

export interface ButtonNodePropertyConfig extends BaseNodePropertyConfig {
    buttonStates: ButtonState[];
}
```

## Tilt Sensor
`type`: "homie-homecontrol/v1/type=tiltsensor"

*Example usages*: Represent a tilt sensor on a box lid or tiltable window.

### Properties

|id|type|settable (defualt)|retained|unit|format|comment
|-|-|-|-|-|-|-|
|state|`boolean`|yes|yes|-|-|`true` = TILTED, `false` = LEVEL

### Configuration
* common config options available



## Motion Sensor
`type`: "homie-homecontrol/v1/type=motionsensor"

*Example usages*: Represent a PIR motion sensor.

### Properties

|id|type|settable (defualt)|retained|unit (default)|format|comment
|-|-|-|-|-|-|-|
|motion|`boolean`|false|yes|-|-|`true` = MOTION, `false` = NO MOTION
|no-motion|`integer`|false|yes|s|-|Seconds since last motion was detected
|lux|`integer`|false|yes|lx|-|Current light intensity in lux

### Specifics
Properties `no-motion` and `lux` are optional.
The `no-motion` property is designed to emit in time intervals (e.g. 30, 60, 120 seconds). Updating continiously every seconds would spam the message bus. Therefore as configuration option you can only specify an array of time intervals.


### Configuration
* common config options available
* Properties `no-motion` and `lux` are optional and can be configured with `boolean` flags whether they should be present or not:
  * `noMotion`
  * `lux`
* `noMotionIntervals` an array of time intervals after which an update is sent when no motions was detected


```typescript
export interface MotionSensorhNodePropertyConfig extends BaseNodePropertyConfig {
    lux: boolean;
    noMotion: boolean;
    noMotionIntervals: number[];
}

export const DefaultNoMotionIntervals = [30, 60, 120, 180, 300];

```

>TODO: Think about an implementation change? 
 Due to the way `no-motion` is implemented (fixed intervals) a more fitting homie datatype would be `enum`. This would also provide information to other consumers of the property at which intervals the property will report.




## Thermostat
`type`: "homie-homecontrol/v1/type=thermostat"
>TODO: ***document this!***

## Mediaplayer
`type`: "homie-homecontrol/v1/type=mediaplayer"
>TODO: ***document this!***

## Powermeter
`type`: "homie-homecontrol/v1/type=powermeter"
>TODO: ***document this!***

## Dimmer
`type`: "homie-homecontrol/v1/type=dimmer"
>TODO: ***document this!***

## Shutter
`type`: "homie-homecontrol/v1/type=shutter"
>TODO: ***document this!***

## Colorlight
`type`: "homie-homecontrol/v1/type=colorlight"
>TODO: ***document this!***

## Text
`type`: "homie-homecontrol/v1/type=text"
>TODO: ***document this!***

## Battery
`type`: "homie-homecontrol/v1/type=battery"
>TODO: ***document this!***

## Maintenance
`type`: "homie-homecontrol/v1/type=maintenance"
>TODO: ***document this!***

## Common configration options
Each node has the following common configuration options:

`settable`:

Configures if all or specific properties should be settable.
Can be either a boolean or an object of booleans with property IDs for which the settable option is specified.

Example:
```typescript

// All properties should be settable
const config_all = {
    settable: true
}

// only toggle property should be settable
const config_specific = {
     settable: {
        state: false,
        toggle: true
     }
}
```

`propertyOpts`:

Provides proptery options for the homie-properties see [node-homie](https://github.com/schaze/node-homie#readme).

Example:
```typescript

// do not attempt to read previous property state from mqtt
const config = {
     propertyOpts: {
         readValueFromMqtt: false,
         readTimeout:0
     }
}

```



