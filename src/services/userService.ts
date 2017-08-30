import * as _ from "lodash";
import * as restangular from "restangular";
import Models from "../models/models";
import ServiceBase from "./serviceBase";

interface IDummyStudent extends Models.Dtos.DisplayUserDto {
    isDummy?: boolean;
}

export default class UserService extends ServiceBase {
    /**
     * 登録サービス名
     */
    public static readonly IID = "userService";

    /**
     * インジェクトするサービス
     */
    public static $inject = ["Restangular", "$q"];

    /**
     * コンストラクタ
     */
    public constructor(
        protected Restangular: restangular.IService,
        protected $q: ng.IQService) {
        super();
    }

    private usersBy: { [userId: string]: Models.Dtos.DisplayUserDto } = {};

    public static DummyStudentOwner: IDummyStudent = {
        displayName: "ダミー学生（自分）",
        id: -9999,
        student: {
            code: "dmystd1",
            memo: "",
        },
        teacher: null,
        isDummy: true,
    };

    public static DummyStudentSameGroup: IDummyStudent = {
        displayName: "ダミー学生（同じグループ）",
        id: -9998,
        student: {
            code: "dmystd2",
            memo: "",
        },
        teacher: null,
        isDummy: true,
    };

    public static DummyStudentSameCourse: IDummyStudent = {
        displayName: "ダミー学生（同じコース）",
        id: -9997,
        student: {
            code: "dmystd3",
            memo: "",
        },
        teacher: null,
        isDummy: true,
    };

    public checkIfDummyUser(user: IDummyStudent): boolean {
        return "isDummy" in user;
    }

    public loadUsers(users: Models.Dtos.DisplayUserDto[]) {
        users.forEach((value, index, array) => {
            this.addUser(value);
        });
        this.addUser(UserService.DummyStudentOwner);
        this.addUser(UserService.DummyStudentSameCourse);
        this.addUser(UserService.DummyStudentSameGroup);
    }

    public addUser(user: Models.Dtos.DisplayUserDto) {
        this.usersBy[user.id] = user;
    }

    public getUser(userId: DtoIdType): Models.Dtos.DisplayUserDto {
        return this.usersBy[userId];
    }

    public getDisplayName(userId: DtoIdType): string {
        // TODO:コンソールエラーが多発するので、暫定的にユーザー情報が取れない場合は
        // displayNameが取得できない場合は固定値を返す
        if (!this.getUser(userId)) { return "表示名"; }
        return this.getUser(userId).displayName;
    }

}
