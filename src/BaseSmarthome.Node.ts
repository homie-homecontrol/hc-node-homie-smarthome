import { HomieDevice, HomieNode, HomieProperty } from "node-homie";
import { HomieNodeAtrributes, HomiePropertyAtrributes } from "node-homie/model";
import { BaseNodePropertyConfig, GetPropIDType, SmarthomePropAttrs } from "./model";
import { checkSettable, getPropertyOptions } from "./util/smarthome.func";

export class BaseSmarthomeNode<P_CFG extends BaseNodePropertyConfig<PROPIDS>, PROPIDS extends string = GetPropIDType<P_CFG>> extends HomieNode {

    constructor(device: HomieDevice, attrs: HomieNodeAtrributes, public readonly propConfig: P_CFG) {
        super(device, attrs);
    }

    protected makeProperty(attrs: SmarthomePropAttrs<PROPIDS>): HomieProperty {
        return this.add(new HomieProperty(this, {
            ...attrs,
            settable: checkSettable(this.propConfig.settable, attrs.id, attrs.settable)
        }, getPropertyOptions(this.propConfig)));
    }
}