import uuidv4 from "../common/uuid";
import Models from "../models/models";

export default class WsSVGImage implements Models.Dtos.SvgImageDto {
    public elements: Anzas.Manacy.Models.Dtos.SvgElementDto[];
    public id = uuidv4();
    public isDeleted: boolean;
    public createDate = new Date().toISOString();
    public lastUpdateDatetime = new Date().toISOString();
    public updateDate = new Date().toISOString();
    constructor(public viewHeight: number, public viewWidth: number, public updateUserId: number, public createUserId: number) {}
}
