import Models from "../../models/models";

export interface IWsElementParams {
    /**
     * BindingされたWsElement
     */
    element: Models.Dtos.WsElementDto;

    /**
     * WSのOwner UserId
     */
    ownerUserId?: DtoIdType;

    /**
     * 指定した場合、現在ログイン中のユーザーをオーバーライドする
     */
    currentUser?: Models.Dtos.UserDto;

    /**
     * EditModeの時True
     */
    editMode?: boolean;

    /**
     * 値が有効かどうか
     */
    isValid?: boolean;

    /**
     * 未保存かどうか
     */
    isDirty?: boolean;
}
