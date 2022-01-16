import { type } from "os";
import { pairwise, takeUntil, tap } from "rxjs/operators";
import { HomieDevice, HomieNode, HomieProperty, } from "node-homie";
import { HomieNodeAtrributes, HOMIE_TYPE_BOOL } from "node-homie/model";
import { SwitchNodePropertyConfig, H_SMARTHOME_TYPE_SWITCH } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";



const DEFAULT_OPTIONS: SwitchNodePropertyConfig = { settable: true }

export class SwitchNode extends BaseSmarthomeNode<SwitchNodePropertyConfig> {


    public readonly propState: HomieProperty;
    public readonly propToggle: HomieProperty;

    public set state(value: boolean) {
        // if (!this.propState.lowBattery) { return; }
        this.propState.value = String(value);

    }
    public get state(): boolean {
        // if (!this.propState.lowBattery) { return undefined; }
        return this.propState.value === 'true';
    }

    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: SwitchNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'switch',
                name: 'On/Off switch',
                type: H_SMARTHOME_TYPE_SWITCH
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propState = this.add(new HomieProperty(this, {
            id: 'state',
            name: 'On/Off state',
            datatype: HOMIE_TYPE_BOOL,
            retained: true,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        this.propToggle = this.add(new HomieProperty(this, {
            id: 'toggle',
            name: 'Toggle On/Off state',
            datatype: HOMIE_TYPE_BOOL,
            retained: false,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        this.propToggle.onSetMessage$.pipe(
            takeUntil(this.onDestroy$),
            tap(event => {
                this.propState.onSetMessage(String(!this.state));
            })
        ).subscribe();

    }
}