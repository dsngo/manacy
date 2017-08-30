import Models from "./../../models/models";

interface IWsPropertiesController {
    onSave(): void;

    // accessLevels: IAccessLevels;
    accessLevels;
    wsDto: Models.Dtos.WsDto;
    semesters;
    isSaved: boolean;
    titleMaxLength: number;
    memoMaxLength: number;
}

// interface IAccessLevels {
//     id: number;
//     label: string;
// }
export default IWsPropertiesController;
// export default IAccessLevels;
