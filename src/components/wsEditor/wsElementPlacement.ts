import * as _ from "lodash";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import WsService from "../../services/wsService";
import ComponentBase from "../componentBase";

interface IWsElementTree {
    element: Models.Dtos.WsElementDto;
    children: IWsElementTree[];
    parent: IWsElementTree;
}

export default class WsElementPlacement extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementPlacement";

    /**
     * エレメントツリー
     */
    public elementTree: IWsElementTree;

    public static $inject: string[] = [WsService.IID, WsEditorService.IID, "$scope"];

    constructor(
        private wsService: WsService,
        private wsEditorService: WsEditorService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/wsEditor/wsElementPlacement.html";
    }

    public $onInit(): void {
        this.updateElementTree();
        this.$scope.$on("element:add/delete", (event: ng.IAngularEvent, args) => {
            this.updateElementTree();
        });
    }

    /**
     * エレメントを移動する。
     * @param elementOrWsElementId
     * @param parentTree
     * @param index
     */
    public move(elementOrWsElementId: Models.Dtos.WsElementDto|number, parentTree: IWsElementTree, index: number): void {
        const element = typeof elementOrWsElementId === "object" ? elementOrWsElementId : this.wsService.elements[elementOrWsElementId];

        element.property.parentId = parentTree.element.wsElementId;
        element.property.sortOrder = this.calcSortOrder(element, parentTree, index);

        this.wsEditorService.save(element);

        this.updateElementTree();
    }

    /**
     * エレメントを上に移動する。
     * @param elementTree
     */
    public moveUp(elementTree: IWsElementTree): void {
        if (!this.canMoveUp(elementTree)) {
            return;
        }

        const index = elementTree.parent.children.indexOf(elementTree);

        this.move(elementTree.element, elementTree.parent, index - 1);
    }

    /**
     * エレメントを左に移動する。
     * @param elementTree
     */
    public moveLeft(elementTree: IWsElementTree): void {
        if (!this.canMoveLeft(elementTree)) {
            return;
        }

        const parent = elementTree.parent.parent;
        const index = parent.children.indexOf(elementTree.parent);

        this.move(elementTree.element, parent, index + 1);
    }

    /**
     * エレメントを右に移動する。
     * @param elementTree
     */
    public moveRight(elementTree: IWsElementTree): void {
        if (!this.canMoveRight(elementTree)) {
            return;
        }

        const parent = elementTree.parent.children[elementTree.parent.children.indexOf(elementTree) - 1];
        const index = parent.children.length;

        this.move(elementTree.element, parent, index);
    }

    /**
     * エレメントを下に移動する。
     * @param elementTree
     */
    public moveDown(elementTree: IWsElementTree): void {
        if (!this.canMoveDown(elementTree)) {
            return;
        }

        const index = elementTree.parent.children.indexOf(elementTree);

        this.move(elementTree.element, elementTree.parent, index + 2);
    }

    /**
     * エレメントを上に移動することができるかを判定する。
     * @param elementTree
     * @return {boolean}
     */
    public canMoveUp(elementTree: IWsElementTree): boolean {
        return _.first(elementTree.parent.children) !== elementTree;
    }

    /**
     * エレメントを左に移動することができるかを判定する。
     * @param elementTree
     * @return {boolean}
     */
    public canMoveLeft(elementTree: IWsElementTree): boolean {
        return elementTree.element.property.parentId !== this.wsService.ws.wsElementId;
    }

    /**
     * エレメントを右に移動することができるかを判定する。
     * @param elementTree
     * @return {boolean}
     */
    public canMoveRight(elementTree: IWsElementTree): boolean {
        return _.first(elementTree.parent.children) !== elementTree;
    }

    /**
     * エレメントを下に移動することができるかを判定する。
     * @param elementTree
     * @return {boolean}
     */
    public canMoveDown(elementTree: IWsElementTree): boolean {
        return _.last(elementTree.parent.children) !== elementTree;
    }

    /**
     * エレメントがアクティブ化を判定する。
     * @param element
     * @return {boolean}
     */
    public hasActive(element: Models.Dtos.WsElementDto): boolean {
        return element === this.wsEditorService.activeElement;
    }

    /**
     * エレメントツリーを更新する。
     */
    private updateElementTree(): void {
        const createElementTree = (wsElementId: number, parentTree: IWsElementTree = null): IWsElementTree => {
            const elementTree = {} as IWsElementTree;

            elementTree.element = this.wsService.elements[wsElementId];

            elementTree.children = this.wsService.getOrderedChildElements(elementTree.element)
                .map((e: Models.Dtos.WsElementDto) => createElementTree(e.wsElementId, elementTree));

            Object.defineProperty(elementTree, "parent", {value: parentTree});

            return elementTree;
        };

        this.elementTree = createElementTree(this.wsService.ws.wsElementId);
    }

    /**
     * 順番を計算する。
     * @param element
     * @param parentTree
     * @param index
     * @return {number}
     */
    private calcSortOrder(element: Models.Dtos.WsElementDto, parentTree: IWsElementTree, index: number): number {
        const getter = (currentIndex: number, next: number): Models.Dtos.WsElementDto => {
            const elementTree = parentTree.children[currentIndex];
            if (elementTree == null) {
                return undefined;
            }

            return elementTree.element.wsElementId !== element.wsElementId ? elementTree.element : getter(currentIndex + next, next);
        };

        const prevElement = getter(index - 1, -1);
        const nextElement = getter(index, 1);

        switch (Number(!!prevElement) + Number(!!nextElement) * 2) {
            case 0: return 100;
            case 1: return prevElement.property.sortOrder + 100;
            case 2: return nextElement.property.sortOrder - 100;
            case 3: return (prevElement.property.sortOrder + nextElement.property.sortOrder) / 2;
        }
    }

    set activeElement(element: Models.Dtos.WsElementDto) {
        this.wsEditorService.activeElement = element;
    }
}
