import { ActionType } from "../../enum/action-type";
import { UiModalType } from "../../enum/ui-modal-type";
import { UiNotification } from "./ui-notification";

export interface GameUiState {
    
    loading : boolean;

    modal : {
        type : UiModalType | null;
        payload? : any;
    }

    notifications : UiNotification[];   // append only

    selectedPoliticoID : number | null;
    selectedMinistryID : number | null;
    selectedActionType : ActionType | null;
}
