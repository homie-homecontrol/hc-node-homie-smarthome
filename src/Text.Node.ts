import { HomieDevice, HomieProperty } from "node-homie";
import { NodeAttributes, HOMIE_TYPE_STRING } from "node-homie/model";
import { H_SMARTHOME_TYPE_TEXT, TextNodePropertyConfig } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";

const DEFAULT_OPTIONS: TextNodePropertyConfig = { settable: true }

export class TextNode extends BaseSmarthomeNode<TextNodePropertyConfig> {

    public readonly propText: HomieProperty;

    public set text(value: string) {
        this.propText.value = String(value);

    }
    public get text(): string {
        return this.propText.value ? this.propText.value : '';
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: TextNodePropertyConfig = { settable: true }) {
        super(device, {
            ...{
                id: 'text',
                name: 'Text node',
                type: H_SMARTHOME_TYPE_TEXT
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propText = this.makeProperty({
            id: 'text',
            name: 'text',
            datatype: HOMIE_TYPE_STRING,
            retained: true,
            settable: true,
        });



    }
}