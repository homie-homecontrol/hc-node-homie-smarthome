import { HomieDevice, HomieNode } from "node-homie";
import { HomieNodeAtrributes } from "node-homie/model";

export class BaseSmarthomeNode<P_CFG> extends HomieNode {
    
    constructor(device: HomieDevice, attrs: HomieNodeAtrributes, public readonly propConfig: P_CFG) {
        super(device, attrs);
    }
}