import { takeUntil } from "rxjs/operators";
import { HomieDevice, HomieProperty } from "node-homie";
import { HOMIE_TYPE_INT, NodeAttributes, HOMIE_TYPE_BOOL, HOMIE_TYPE_ENUM } from "node-homie/model";
import { DimmerNodePropertyConfig, H_SMARTHOME_TYPE_DIMMER } from "./model/Smarthome.model";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: DimmerNodePropertyConfig = { step: 10, stepToZero: false, settable: true }


export class DimmerNode extends BaseSmarthomeNode<DimmerNodePropertyConfig> {

    public readonly propBrightness: HomieProperty;
    public readonly propAction: HomieProperty;

    public set brightness(value: number) {
        this.propBrightness.value = String(value);

    }
    public get brightness(): number {
        return this.propBrightness.value ? parseInt(this.propBrightness.value) : 0;
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: DimmerNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'dimmer',
                name: 'Dimmer control',
                type: H_SMARTHOME_TYPE_DIMMER
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propBrightness = this.makeProperty({
            id: 'brightness',
            name: 'Brightness',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: true,
            unit: '%'
        });

        this.propAction = this.makeProperty({
            id: 'action',
            name: 'Change brighntess',
            datatype: HOMIE_TYPE_ENUM,
            retained: false,
            settable: true,
            format: ['brighter', 'darker'].join(',')
        });

        this.propAction.onSetMessage$.pipe(takeUntil(this.onDestroy$)).subscribe({
            next: event => {
                if (event.valueStr === 'darker') {
                    this.darker();
                } else if (event.valueStr === 'brighter') {
                    this.brighter();
                }
            }
        });
    }

    public brighter() {
        const newVal = this.brightness + this.propConfig.step;
        this.propBrightness.onSetMessage(String(Math.min(newVal, 100)));
    }

    public darker() {
        const newVal = this.brightness - this.propConfig.step;
        this.propBrightness.onSetMessage(String(Math.max(newVal, this.propConfig.stepToZero ? 0 : 1)));
    }
}