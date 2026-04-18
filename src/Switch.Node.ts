import { type } from "os";
import { pairwise, takeUntil, tap } from "rxjs/operators";
import { HomieDevice, HomieNode, HomieProperty, } from "node-homie";
import { NodeAttributes, HOMIE_TYPE_BOOL, HOMIE_TYPE_ENUM } from "node-homie/model";
import { SwitchNodePropertyConfig, H_SMARTHOME_TYPE_SWITCH } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";



const DEFAULT_OPTIONS: SwitchNodePropertyConfig = { settable: true }

export class SwitchNode extends BaseSmarthomeNode<SwitchNodePropertyConfig> {


    public readonly propState: HomieProperty;
    public readonly propAction: HomieProperty;

    public set state(value: boolean) {
        // if (!this.propState.lowBattery) { return; }
        this.propState.value = String(value);

    }
    public get state(): boolean {
        // if (!this.propState.lowBattery) { return undefined; }
        return this.propState.value === 'true';
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: SwitchNodePropertyConfig = DEFAULT_OPTIONS) {
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

        this.propState = this.makeProperty({
            id: 'state',
            name: 'On/Off state',
            datatype: HOMIE_TYPE_BOOL,
            retained: true,
            settable: true,
        });

        this.propAction = this.makeProperty({
            id: 'action',
            name: 'Change state',
            datatype: HOMIE_TYPE_ENUM,
            retained: false,
            settable: true,
            format: 'toggle'
        });

        this.propAction.onSetMessage$.pipe(takeUntil(this.onDestroy$)).subscribe({
            next: event => {
                if (event.valueStr === 'toggle') {
                    this.toogle();
                }
            }
        });

    }

    public toogle(){
        this.propState.onSetMessage(String(!this.state));
    }
}