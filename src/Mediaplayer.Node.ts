import { HomieDevice, HomieProperty } from "node-homie";
import { HOMIE_TYPE_FLOAT, HomieNodeAtrributes, HOMIE_TYPE_ENUM, HOMIE_TYPE_INT, HOMIE_TYPE_STRING, HOMIE_TYPE_BOOL } from "node-homie/model";
import { MediaplayerPropertyConfig, PlayerActions, H_SMARTHOME_TYPE_MEDIAPLAYER } from "./model/Smarthome.model";
import { stringToBool } from "node-homie/util";
import { checkSettable, getPropertyOptions } from "./util/smarthome.func";
import { BaseSmarthomeNode } from "./BaseSmarthome.Node";


const DEFAULT_OPTIONS: MediaplayerPropertyConfig = {
    next: true,
    previous: true,
    forward: true,
    rewind: true,
    stop:true,
    position: true,
    volume: true,
    mediaUrl: true,
    mute: true,
    repeat: false,
    shuffle: false,
    trackInfo: false
}

export class MediaplayerNode extends BaseSmarthomeNode<MediaplayerPropertyConfig> {

    protected readonly playerActions?: string[];


    public readonly propPlayerAction?: HomieProperty;
    public set playerAction(value: string) {
        this.propPlayerAction!.value = value;
    }

    public readonly propPosition?: HomieProperty;
    public set position(value: number) {
        if (!this.propConfig.position) { return; }
        if (this.position !== value) {
            this.propPosition!.value = String(value);
        }
    }
    public get position(): number {
        if (!this.propConfig.position) { return 0; }
        return this.propPosition!.value ? parseInt(this.propPosition!.value) : 0;
    }


    public readonly propVolume?: HomieProperty;
    public set volume(value: number) {
        if (!this.propConfig.volume) { return; }
        if (this.volume !== value) {
            this.propVolume!.value = String(value);
        }
    }
    public get volume(): number {
        if (!this.propConfig.volume) { return 0; }
        return this.propVolume!.value ? parseFloat(this.propVolume!.value) : 0;
    }


    public readonly propMediaUrl?: HomieProperty;
    public set mediaUrl(value: string) {
        if (!this.propConfig.mediaUrl) { return; }
        if (this.mediaUrl !== value) {
            this.propMediaUrl!.value = value || "";
        }
    }
    public get mediaUrl(): string {
        if (!this.propConfig.mediaUrl) { return ""; }
        return this.propMediaUrl!.value ? this.propMediaUrl!.value : "";
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
        if (!this.propConfig.mute) { return; }
        if (this.mute !== value) {
            this.propMute!.value = String(value);
        }
    }
    public get mute(): boolean {
        if (!this.propConfig.mute) { return false; }
        return stringToBool(this.propMute!.value);
    }

    public readonly propShuffle?: HomieProperty;
    public set shuffle(value: boolean) {
        if (!this.propConfig.shuffle) { return; }
        if (this.shuffle !== value) {
            this.propShuffle!.value = String(value);
        }
    }
    public get shuffle(): boolean {
        if (!this.propConfig.shuffle) { return false; }
        return stringToBool(this.propShuffle!.value);
    }

    public readonly propRepeat?: HomieProperty;
    public set repeat(value: boolean) {
        if (!this.propConfig.repeat) { return; }
        if (this.repeat !== value) {
            this.propRepeat!.value = String(value);
        }
    }
    public get repeat(): boolean {
        if (!this.propConfig.repeat) { return false; }
        return stringToBool(this.propRepeat!.value);
    }

    public readonly propTitle?: HomieProperty;
    public set title(value: string) {
        if (!this.propConfig.trackInfo) { return; }
        if (this.title !== value) {
            this.propTitle!.value = value;
        }
    }
    public get title(): string {
        if (!this.propConfig.trackInfo) { return ""; }
        return this.propTitle!.value ? this.propTitle!.value : "";
    }


    public readonly propArtist?: HomieProperty;
    public set artist(value: string) {
        if (!this.propConfig.trackInfo) { return; }
        if (this.artist !== value) {
            this.propArtist!.value = value || "";
        }
    }
    public get artist(): string {
        if (!this.propConfig.trackInfo) { return ""; }
        return this.propArtist!.value ? this.propArtist!.value : "";
    }

    public readonly propAlbum?: HomieProperty;
    public set album(value: string) {
        if (!this.propConfig.trackInfo) { return; }
        if (this.album !== value) {
            this.propAlbum!.value = value || "";
        }
    }
    public get album(): string {
        if (!this.propConfig.trackInfo) { return ""; }
        return this.propAlbum!.value ? this.propAlbum!.value : "";
    }


    public readonly propDuration?: HomieProperty;
    public set duration(value: number) {
        if (!this.propConfig.trackInfo) { return; }
        if (this.duration !== value){
            this.propDuration!.value = String(value);
        }
    }
    public get duration(): number {
        if (!this.propConfig.trackInfo) { return 0; }
        return this.propDuration!.value ? parseInt(this.propDuration!.value) : 0;
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


        this.propPlayerAction = this.add(new HomieProperty(this, {
            id: 'player-action',
            name: 'Player action',
            datatype: HOMIE_TYPE_ENUM,
            retained: false,
            settable: checkSettable(this.propConfig.settable, 'player-action', true),
            format: this.playerActions!.join(",")
        }, getPropertyOptions(propConfig)));


        if (propConfig.position) {
            this.propPosition = this.add(new HomieProperty(this, {
                id: 'position',
                name: 'Position',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'position'),
                unit: `s`
            }, getPropertyOptions(propConfig)));
        }



        if (propConfig.volume) {
            this.propVolume = this.add(new HomieProperty(this, {
                id: 'volume',
                name: 'Volume',
                datatype: HOMIE_TYPE_FLOAT,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'volume', true),
                unit: `%`
            }, getPropertyOptions(propConfig)));
        }


        if (propConfig.mediaUrl) {
            this.propMediaUrl = this.add(new HomieProperty(this, {
                id: 'media-url',
                name: 'Media url',
                datatype: HOMIE_TYPE_STRING,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'media-url')
            }, getPropertyOptions(propConfig)));
        }

        this.propPlayState = this.add(new HomieProperty(this, {
            id: 'play-state',
            name: 'Play state',
            datatype: HOMIE_TYPE_ENUM,
            retained: true,
            settable: checkSettable(this.propConfig.settable, 'play-state', true),
            format: ['playing', 'paused', 'stopped'].join(",")
        }, getPropertyOptions(propConfig)));


        if (propConfig.mute) {
            this.propMute = this.add(new HomieProperty(this, {
                id: 'mute',
                name: 'Mute volume',
                datatype: HOMIE_TYPE_BOOL,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'mute', true)
            }, getPropertyOptions(propConfig)));
        }


        if (propConfig.shuffle) {
            this.propShuffle = this.add(new HomieProperty(this, {
                id: 'shuffle',
                name: 'Shuffle playlist',
                datatype: HOMIE_TYPE_BOOL,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'shuffle')
            }, getPropertyOptions(propConfig)));
        }

        if (propConfig.repeat) {
            this.propRepeat = this.add(new HomieProperty(this, {
                id: 'repeat',
                name: 'Repeat playlist',
                datatype: HOMIE_TYPE_BOOL,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'repeat')
            }, getPropertyOptions(propConfig)));
        }

        if (propConfig.trackInfo){

            this.propTitle = this.add(new HomieProperty(this, {
                id: 'title',
                name: 'Track title',
                datatype: HOMIE_TYPE_STRING,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'title')
            }, getPropertyOptions(propConfig)));

            this.propArtist = this.add(new HomieProperty(this, {
                id: 'artist',
                name: 'Track artist',
                datatype: HOMIE_TYPE_STRING,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'artist')
            }, getPropertyOptions(propConfig)));

            this.propAlbum = this.add(new HomieProperty(this, {
                id: 'album',
                name: 'Track album',
                datatype: HOMIE_TYPE_STRING,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'album')
            }, getPropertyOptions(propConfig)));

            this.propDuration = this.add(new HomieProperty(this, {
                id: 'duration',
                name: 'Track duration',
                datatype: HOMIE_TYPE_INT,
                retained: true,
                settable: checkSettable(this.propConfig.settable, 'album'),
                unit: 's'
            }, getPropertyOptions(propConfig)));


        }
    }


}