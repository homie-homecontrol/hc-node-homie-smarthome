import { from, of, timer } from "rxjs";
import { filter, mapTo, mergeMap, switchMap, takeUntil } from "rxjs/operators";
import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HOMIE_TYPE_BOOL, HOMIE_TYPE_INT, HomieNodeAtrributes } from "node-homie/model";
import { MotionSensorhNodePropertyConfig, DefaultNoMotionIntervals, H_SMARTHOME_TYPE_MOTION_SENSOR } from "./model/Smarthome.model";
import { getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: MotionSensorhNodePropertyConfig = { lux: true, noMotion: true, noMotionIntervals: DefaultNoMotionIntervals, settable: false }


export class MotionSensorNode extends BaseSmarthomeNode<MotionSensorhNodePropertyConfig> {

    public readonly propMotion: HomieProperty;
    public set motion(value: boolean) {
        this.propMotion.value = String(value);
    }
    public get motion(): boolean {
        return this.propMotion.value === 'true';
    }

    public readonly propNoMotion?: HomieProperty;
    public set noMotion(value: number) {
        if (!this.propConfig.noMotion) { return; }
        this.propNoMotion!.value = String(value);
    }
    public get noMotion(): number {
        if (!this.propConfig.noMotion) { return 0; }
        return this.propNoMotion!.value ? parseInt(this.propNoMotion!.value, 10): 0
    }

    public readonly propLux?: HomieProperty;
    public set lux(value: number) {
        if (!this.propConfig.lux) { return; }
        this.propLux!.value = String(value);

    }
    public get lux(): number {
        if (!this.propConfig.lux) { return 0; }
        return this.propLux!.value ? parseFloat(this.propLux!.value): 0;
    }


    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: MotionSensorhNodePropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'motion',
                name: 'Motion sensor',
                type: H_SMARTHOME_TYPE_MOTION_SENSOR
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.propMotion = this.add(new HomieProperty(this, {
            id: 'motion',
            name: 'Motion detected',
            datatype: HOMIE_TYPE_BOOL,
            retained: true,
            settable: this.propConfig.settable === true,
        }, getPropertyOptions(propConfig)));

        if (this.propConfig.noMotion) {
            this.propNoMotion = this.add(new HomieProperty(this, {
                id: 'no-motion',
                name: 'No motion detected since',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: this.propConfig.settable === true,
                unit: "s"
            }, getPropertyOptions(propConfig)));
            this.noMotion = 0;
        }

        if (this.propConfig.lux) {
            this.propLux = this.add(new HomieProperty(this, {
                id: 'lux',
                name: 'Current lightlevel',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: this.propConfig.settable === true,
                unit: "lx"
            }, getPropertyOptions(propConfig)));
        }

    }

    public override async onInit() {
        super.onInit();
        if (this.propConfig.noMotion) {
            this.propMotion.value$.pipe(
                takeUntil(this.onDestroy$),
                filter(motion => motion !== undefined),
                switchMap(motion => from(motion === 'true' ? [0] : this.propConfig.noMotionIntervals).pipe(
                    mergeMap(time => {
                        if (time === 0) {
                            return of(0);
                        }
                        return timer(time * 1000).pipe(mapTo(time))
                    })
                ))
            ).subscribe(time => {
                this.noMotion = time;
            })
        }
    }

}