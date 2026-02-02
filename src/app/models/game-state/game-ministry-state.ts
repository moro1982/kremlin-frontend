import { MinistryType } from "../../enum/ministry-type";

export interface GameMinistryState {

    id : number;
    name : MinistryType;
    purgeNr : number;
    ministerID? : number;
    isVacant : boolean;
    /* May be useful later... */
    // delegatedToPoliticoID? : number;

    /* Useless legacy prop (purge modifier is calculated during Purge resolution) */
    // purgeModifier : number;
}
