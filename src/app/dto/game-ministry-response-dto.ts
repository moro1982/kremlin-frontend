import { MinistryResponseDto } from "./ministry-response-dto";

export interface GameMinistryResponseDto {
    id : number;
    ministry : MinistryResponseDto;
    gameID : number;
    ministerID : number;
    isVacant : boolean;
    
    /* Useless legacy prop (purge modifier is calculated during Purge resolution) */
    purgeModifier : number;
}
