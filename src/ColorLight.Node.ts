import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HomieRGBColor, HOMIE_TYPE_COLOR, HOMIE_TYPE_INT, HomieNodeAtrributes, HomieHSVColor, isHomieRGBColor } from "node-homie/model";
import { hsvColorToString, parseHSVColor, parseRGBColor, rgbColorToString } from "node-homie/util";
import { ColorLightNodePropertyConfig, H_SMARTHOME_TYPE_COLORLIGHT } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: ColorLightNodePropertyConfig = { ctmin: 153, ctmax: 555, colorMode: 'rgb', settable: true }

export class ColorLightNode extends BaseSmarthomeNode<ColorLightNodePropertyConfig> {

    public readonly propColor: HomieProperty;
    public readonly propColorTemperature: HomieProperty;
    // public readonly propPressure?: HomieProperty;


    public set color(value: HomieRGBColor | HomieHSVColor) {
        this.propColor.value = isHomieRGBColor(value) ? rgbColorToString(value) : hsvColorToString(value);

    }
    public get color(): HomieRGBColor | HomieHSVColor {
        return this.propConfig.colorMode === 'rgb' ? parseRGBColor(this.propColor.value) : parseHSVColor(this.propColor.value);
    }

    public set colorTemperature(value: number) {
        if (value > this.propConfig.ctmax || value < this.propConfig.ctmin) { return; }
        this.propColorTemperature.value = String(value);

    }
    public get colorTemperature(): number {
        return parseInt(this.propColorTemperature.value!, 10)
    }

    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: ColorLightNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'colorlight',
                name: 'Color control',
                type: H_SMARTHOME_TYPE_COLORLIGHT
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propColor = this.add(new HomieProperty(this, {
            id: 'color',
            name: 'Color',
            datatype: HOMIE_TYPE_COLOR,
            retained: true,
            settable: this.propConfig.settable === true,
            format: this.propConfig.colorMode
        }, getPropertyOptions(propConfig)));

        this.propColorTemperature = this.add(new HomieProperty(this, {
            id: 'color-temperature',
            name: 'Color Temperature',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: this.propConfig.settable === true,
            unit: "Mired",
            format: `${this.propConfig.ctmin}:${this.propConfig.ctmax}`
        }, getPropertyOptions(propConfig)));

    }




}