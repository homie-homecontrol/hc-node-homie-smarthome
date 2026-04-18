import { HomieDevice, HomieProperty } from "node-homie";
import { HOMIE_TYPE_INT, NodeAttributes, HOMIE_TYPE_BOOL, HOMIE_TYPE_ENUM } from "node-homie/model";
import { H_SMARTHOME_TYPE_SHUTTER, ShutterNodePropertyConfig } from "./model/Smarthome.model";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";
import { takeUntil } from "rxjs";

const DEFAULT_OPTIONS = <ShutterNodePropertyConfig>{ canStop: true, settable: true, implementUpDown: true };


export class ShutterNode extends BaseSmarthomeNode<ShutterNodePropertyConfig> {


    public readonly propPosition: HomieProperty;
    public readonly propAction: HomieProperty;

    public set position(value: number) {
        this.propPosition.value = String(value);

    }
    public get position(): number {
        return this.propPosition.value ? parseInt(this.propPosition.value) : 0;
    }

    constructor(device: HomieDevice, attrs: Partial<NodeAttributes> = {}, propConfig: ShutterNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'shutter',
                name: 'Shutter control',
                type: H_SMARTHOME_TYPE_SHUTTER
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propPosition = this.makeProperty({
            id: 'position',
            name: 'Shutter position',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: true,
            unit: '%'
        });

        const actions = ['up', 'down'];
        if (this.propConfig.canStop){
            actions.push('stop')
        }

        this.propAction = this.makeProperty({
            id: 'action',
            name: 'control shutter action',
            datatype: HOMIE_TYPE_ENUM,
            retained: false,
            settable: true,
            format: actions.join(',')
        });

       if (this.propConfig.implementUpDown){
           this.propAction.onSetMessage$.pipe(takeUntil(this.onDestroy$)).subscribe({
            next: event => {
                if (event.valueStr === 'up') {
                    this.up();
                } else if (event.valueStr === 'down') {
                    this.down();
                }
            }
        });
       }

    }

    public up() {
        this.propPosition.onSetMessage(String(0));
    }

    public down() {
        this.propPosition.onSetMessage(String(100));
    }
}