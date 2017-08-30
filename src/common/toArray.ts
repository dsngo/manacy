/**
 * Object CollectionをArrayに変換するフィルタ
 * ng-repeat="user in users | toArray | orderBy:'name'"等として使う。
 * https://stackoverflow.com/questions/14955146/how-to-sort-object-data-source-in-ng-repeat-in-angularjs
 */
import * as angular from "angular";

export default function register(app: ng.IModule) {
    app.filter("toArray", () => {
        return (obj) => {
            const result = [];
            angular.forEach(obj, (val, key) => {
                result.push(val);
            });
            return result;
        };
    });
}
