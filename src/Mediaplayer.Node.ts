import { HomieDevice, HomieProperty } from "node-homie";
import { HOMIE_TYPE_FLOAT, HomieNodeAtrributes, HOMIE_TYPE_ENUM, HOMIE_TYPE_INT, HOMIE_TYPE_STRING, HOMIE_TYPE_BOOL } from "node-homie/model";
import { MediaplayerPropertyConfig, PlayerActions, H_SMARTHOME_TYPE_MEDIAPLAYER, MediaPlayerControlStateFormat } from "./model/Smarthome.model";
import { stringToBool } from "node-homie/util";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: MediaplayerPropertyConfig = {
    next: true,
    previous: true,
    forward: true,
    rewind: true,
    stop: true
}


export class MediaplayerNode extends BaseSmarthomeNode<MediaplayerPropertyConfig> {

    protected readonly playerActions?: string[];


    public readonly propPlayerAction?: HomieProperty;
    public set playerAction(value: string) {
        this.propPlayerAction!.value = value;
    }

    public readonly propMediaProgress?: HomieProperty;
    public set mediaProgress(value: number) {
        if (this.mediaProgress !== value) {
            this.propMediaProgress!.value = String(value);
        }
    }
    public get mediaProgress(): number {
        return this.propMediaProgress!.value ? parseInt(this.propMediaProgress!.value) : 0;
    }


    public readonly propMediaLength?: HomieProperty;
    public set mediaLength(value: number) {
        if (this.mediaLength !== value) {
            this.propMediaLength!.value = String(value);
        }
    }
    public get mediaLength(): number {
        return this.propMediaLength!.value ? parseInt(this.propMediaLength!.value) : 0;
    }



    public readonly propVolume?: HomieProperty;
    public set volume(value: number) {
        if (this.volume !== value) {
            this.propVolume!.value = String(value);
        }
    }
    public get volume(): number {
        return this.propVolume!.value ? parseFloat(this.propVolume!.value) : 0;
    }


    public readonly propArtUrl?: HomieProperty;
    public set artUrl(value: string) {
        if (this.artUrl !== value) {
            this.propArtUrl!.value = value || "";
        }
    }
    public get artUrl(): string {
        return this.propArtUrl!.value ? this.propArtUrl!.value : "";
    }

    public readonly propPlayState?: HomieProperty;
    public set playState(value: string) {
        if (this.playState !== value) {
            this.propPlayState!.value = value;
        }
    }
    public get playState(): string {
        return this.propPlayState!.value ? this.propPlayState!.value : "";
    }

    public readonly propMute?: HomieProperty;
    public set mute(value: boolean) {
        if (this.mute !== value) {
            this.propMute!.value = String(value);
        }
    }
    public get mute(): boolean {
        return stringToBool(this.propMute!.value);
    }

    public readonly propShuffle?: HomieProperty;
    public set shuffle(value: boolean) {
        if (this.shuffle !== value) {
            this.propShuffle!.value = String(value);
        }
    }
    public get shuffle(): boolean {
        return stringToBool(this.propShuffle!.value);
    }

    public readonly propRepeat?: HomieProperty;
    public set repeat(value: boolean) {
        if (this.repeat !== value) {
            this.propRepeat!.value = String(value);
        }
    }
    public get repeat(): boolean {
        return stringToBool(this.propRepeat!.value);
    }

    public readonly propTitle?: HomieProperty;
    public set title(value: string) {
        if (this.title !== value) {
            this.propTitle!.value = value;
        }
    }
    public get title(): string {
        return this.propTitle!.value ? this.propTitle!.value : "";
    }


    public readonly propSubText1?: HomieProperty;
    public set subText1(value: string) {
        if (this.subText1 !== value) {
            this.propSubText1!.value = value || "";
        }
    }
    public get subText1(): string {
        return this.propSubText1!.value ? this.propSubText1!.value : "";
    }

    public readonly propSubText2?: HomieProperty;
    public set subText2(value: string) {
        if (this.subText2 !== value) {
            this.propSubText2!.value = value || "";
        }
    }
    public get subText2(): string {
        return this.propSubText2!.value ? this.propSubText2!.value : "";
    }


    constructor(device: HomieDevice, attrs: Partial<HomieNodeAtrributes> = {}, propConfig: MediaplayerPropertyConfig = DEFAULT_OPTIONS) {
        super(device, {
            ...{
                id: 'mediaplayer',
                name: 'Media player',
                type: H_SMARTHOME_TYPE_MEDIAPLAYER
            },
            ...attrs
        },
            { ...DEFAULT_OPTIONS, ...propConfig }
        );

        this.playerActions = PlayerActions.filter(action => {
            if (!this.propConfig.previous && action === 'previous') { return false; }
            if (!this.propConfig.next && action === 'next') { return false; }
            if (!this.propConfig.rewind && action === 'rewind') { return false; }
            if (!this.propConfig.forward && action === 'forward') { return false; }
            if (!this.propConfig.stop && action === 'stop') { return false; }
            return true;
        })


        this.propPlayerAction = this.makeProperty({
            id: 'player-action',
            name: 'Player action',
            datatype: HOMIE_TYPE_ENUM,
            retained: false,
            settable: true,
            format: this.playerActions!.join(",")
        });

        this.propMediaProgress = this.makeProperty({
            id: 'media-progress',
            name: 'Media Progress',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: false,
            unit: `s`
        });


        this.propMediaLength = this.makeProperty({
            id: 'media-length',
            name: 'Media length',
            datatype: HOMIE_TYPE_INT,
            retained: true,
            settable: false,
            unit: `s`
        });

        this.propVolume = this.makeProperty({
            id: 'volume',
            name: 'Volume',
            datatype: HOMIE_TYPE_FLOAT,
            retained: true,
            settable: true,
            unit: `%`
        });

        this.propArtUrl = this.makeProperty({
            id: 'art-url',
            name: 'Artt url',
            datatype: HOMIE_TYPE_STRING,
            retained: true,
            settable: false
        });


        this.propPlayState = this.makeProperty({
            id: 'play-state',
            name: 'Play state',
            datatype: HOMIE_TYPE_ENUM,
            retained: true,
            settable: false,
            format: ['playing', 'paused', 'stopped'].join(",")
        });


        this.propMute = this.makeProperty({
            id: 'mute',
            name: 'Mute volume',
            datatype: HOMIE_TYPE_ENUM,
            retained: true,
            settable: true,
            format: MediaPlayerControlStateFormat
        });



        this.propShuffle = this.makeProperty({
            id: 'shuffle',
            name: 'Shuffle playlist',
            datatype: HOMIE_TYPE_ENUM,
            retained: true,
            settable: true,
            format: MediaPlayerControlStateFormat
        });


        this.propRepeat = this.makeProperty({
            id: 'repeat',
            name: 'Repeat playlist',
            datatype: HOMIE_TYPE_ENUM,
            retained: true,
            settable: true,
            format: MediaPlayerControlStateFormat
        });


        this.propTitle = this.makeProperty({
            id: 'title',
            name: 'Title',
            datatype: HOMIE_TYPE_STRING,
            retained: true,
            settable: false
        });

        this.propSubText1 = this.makeProperty({
            id: 'subtext1',
            name: 'Subtext 1',
            datatype: HOMIE_TYPE_STRING,
            retained: true,
            settable: false
        });

        this.propSubText1 = this.makeProperty({
            id: 'subtext2',
            name: 'Subtext 2',
            datatype: HOMIE_TYPE_STRING,
            retained: true,
            settable: false
        });

    }


}