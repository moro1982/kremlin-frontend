import { UiNotificationType } from "../../enum/ui-notification-type";

export interface UiNotification {
    id : string;                // timestamp?
    type : UiNotificationType;  // severity
    message : string;           // shown text
    ttl? : number;              // time-to-live (ms)
}
