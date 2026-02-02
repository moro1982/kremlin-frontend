import { MinistryType } from "../enum/ministry-type";

export interface PoliticoResponseDto {
    id : number;
    name : string;
    alias : string;
    initialAge : number;
    advantage : MinistryType;
    disadvantage : MinistryType;
}
