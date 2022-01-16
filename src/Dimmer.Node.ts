import { takeUntil, tap } from "rxjs/operators";
import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_INT, HomieNodeAtrributes, HOMIE_TYPE_BOOL } from "node-homie/model";
import { DimmerNodePropertyConfig, H_SMARTHOME_TYPE_DIMMER } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: DimmerNodePropertyConfig = { step: 10, stepToZero: false, settable: true }


export class DimmerNode extends BaseSmarthomeNode<DimmerNodePropertyConfig> {


    public readonly propBrightness: HomieProperty;
    public readonly propBrighter: HomieProperty;
    public readonly propDarker: HomieProperty;

    public set brightness(value: number) {
        // if (!this.propState.lowBattery) { return; }
        this.propBrightness.value = String(value);

    }
    public get brightness(): number {
        // if (!this.propState.lowBattery) { return undefined; }
        return this.propBrightness.value ? parseInt(this.propBrightness.value) : 0;
    }

    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: DimmerNodePropertyConfig = DEFAULT_OPTIONS) {
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

        this.propBrightness = this.add(new HomieProperty(this, {
            id: 'brightness',
            name: 'Brightness',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: this.propConfig.settable === true,
            unit: '%'
        }, getPropertyOptions(propConfig)));

        this.propBrighter = this.add(new HomieProperty(this, {
            id: 'brighter',
            name: 'Increase brighntess',
            datatype: HOMIE_TYPE_BOOL,
            retained: false,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        this.propDarker = this.add(new HomieProperty(this, {
            id: 'darker',
            name: 'Decrease brighntess',
            datatype: HOMIE_TYPE_BOOL,
            retained: false,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        this.propBrighter.onSetMessage$.pipe(
            takeUntil(this.onDestroy$),
            tap(event => {
                const newVal = this.brightness + this.propConfig.step;
                this.propBrightness.onSetMessage(String(Math.min(newVal, 100)));
            })
        ).subscribe();

        this.propDarker.onSetMessage$.pipe(
            takeUntil(this.onDestroy$),
            tap(event => {
                const newVal = this.brightness - this.propConfig.step;
                this.propBrightness.onSetMessage(String(Math.max(newVal, this.propConfig.stepToZero ? 0 : 1)));
            })
        ).subscribe();
    }
}