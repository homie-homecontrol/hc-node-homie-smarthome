import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_ENUM, HomieNodeAtrributes } from "node-homie/model";
import { ButtonNodePropertyConfig, ButtonState, H_SMARTHOME_TYPE_BUTTON, SmarthomeTypeButtonProps } from "./model/Smarthome.model";
import { checkSettable, getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: ButtonNodePropertyConfig = { buttonStates: ['press', 'long-press'], settable: false };


/**
 * TODO: Evaluate idea of adding more logic to this. E.g. adding a "ON For x Seconds" property to enable easy automatic lightsout mode
 */
export class ButtonNode extends BaseSmarthomeNode<ButtonNodePropertyConfig> {


    public readonly propAction: HomieProperty;

    public set action(value: ButtonState) {
        if (this.propConfig.buttonStates.includes(value as any)) {
            this.propAction.value = value;
        }
    }
    public get action(): ButtonState {
        return this.propAction.value as ButtonState;
    }

    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: ButtonNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'button',
                name: 'Pushbutton',
                type: H_SMARTHOME_TYPE_BUTTON
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig });


        this.propAction = this.makeProperty({
            id: 'action',
            name: 'Button action event',
            datatype: HOMIE_TYPE_ENUM,
            retained: false,
            settable: false,
            format: this.propConfig.buttonStates.join(',')
        });

    }
}