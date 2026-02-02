import { MinistryType } from "../enum/ministry-type";

export interface MinistryResponseDto {
    id : number;
    name : MinistryType;
    purgeNr : number;
}
