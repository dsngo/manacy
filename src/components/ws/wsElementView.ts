import * as _ from "lodash";
import Models from "../../models/models";
import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";
import { IWsElementParams } from "./wsElementParams";

interface IUserWithParam extends Models.Dtos.DisplayUserDto {
    param?: IWsElementParams;
}

interface IUserGroupParam {
    [groupName: string]: IUserWithParam[];
}

export default class WsElementView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            element: "<",
            userGroups: "<",
        };
        options.templateUrl = "../components/ws/wsElementView.html";
        options.transclude = true;
    }

    public element: Models.Dtos.WsElementDto;
    public userGroups: Ws.IUserGroups;

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, "$scope"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        protected $scope: ng.IScope,
    ) {
        super();
    }

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        this.onLoad();
        this.$scope.$watch(() => this.element, () => {
            this.onLoad();
        });
    }

    public userGroupParam: IUserGroupParam;

    protected onLoad(): void {
        this.userGroupParam = null;
        this.userGroupParam = _.cloneDeep(this.userGroups);
        _.each(this.userGroupParam, (group) => {
            _.each(group, (user) => {
                user.param = { element: this.element, ownerUserId: user.id };
            });
        });
    }

    // public getParams(ownerUserId: DtoIdType): IWsElementParams {
    //     return { element: this.element, ownerUserId };
    // }

    /**
     * group毎に、表示すべきエントリー数を数える
     */
    public countUsersInGroup(group: Models.Dtos.DisplayUserDto[]): number {
        return group.reduce((prev, curr, index, arr) => {
            return Object.keys(this.wsAssignmentService.getEntriesByAuthor(this.element, curr.id)).length > 0 ? prev + 1 : prev;
        }, 0);
    }

    public countUsersInOwner(ownerUserId: DtoIdType): number {
        return Object.keys(this.wsAssignmentService.getEntriesByAuthor(this.element, ownerUserId)).length;
    }

    public get othersWritable(): boolean {
        const accessLevel = this.element.property.accessLevel;
        return accessLevel.studentGroup === Models.AccessPermissionEnum.ReadWrite ||
            accessLevel.studentCourse === Models.AccessPermissionEnum.ReadWrite ||
            accessLevel.teacherGroup === Models.AccessPermissionEnum.ReadWrite ||
            accessLevel.teacherCourse === Models.AccessPermissionEnum.ReadWrite;
    }

    public get isSharedInCourse(): boolean {
        return this.element.property.shareLevel === Models.Worksheet.WsElementShareLevelEnum.Course;
    }

    public get isSharedInGroup(): boolean {
        return this.element.property.shareLevel === Models.Worksheet.WsElementShareLevelEnum.Group;
    }

    public get isIndividual(): boolean {
        return this.element.property.shareLevel === Models.Worksheet.WsElementShareLevelEnum.Individual;
    }

}
