import Models from "../models/models";

export default class WsSVGElement implements Models.Dtos.SvgElementDto {
    public id = Date.now();
    public isDeleted = false;
    public updateDate = new Date().toISOString();
    public createDate = new Date().toISOString();
    constructor(public element: any, public updateUserId: number, public createUserId: number) {}
}
