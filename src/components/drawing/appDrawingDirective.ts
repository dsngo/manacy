export default class AppDrawingDirective {
    public static register(appModule) {
        touchsEvents(appModule);
        draggable(appModule);
    }
}

function touchsEvents(appModule) {
    ["touchstart", "touchmove", "touchend"].forEach(eventName => {
        function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        const directiveName = "dr" + capitalizeFirstLetter(eventName);
        appModule.directive(directiveName, [
            "$parse",
            "$rootScope",
            ($parse, $rootScope) => {
                return {
                    restrict: "A",
                    compile($element, attr) {
                        const forceAsyncEvents = {
                            blur: true,
                            focus: true,
                        };
                        const fn = $parse(attr[directiveName], /* interceptorFn */ null, /* expensiveChecks */ true);
                        return function ngEventHandler(scope, element) {
                            element.on(eventName, event => {
                                event.preventDefault();
                                const callback = () => {
                                    fn(scope, { $event: event });
                                };
                                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                                    scope.$evalAsync(callback);
                                } else {
                                    scope.$apply(callback);
                                }
                            });
                        };
                    },
                };
            },
        ]);
    });
}

function draggable(appModule) {
    appModule.directive("elDraggable", () => {
        return {
            scope: {
                posX: "=",
                posY: "=",
                parentId: "@",
                offStyle: "<",
            },
            controller: [
                "$scope",
                "$element",
                "$document",
                "$window",
                ($scope, $element, $document, $window) => {
                    let startX = 0;
                    let startY = 0;
                    const parentElement = $document[0].getElementById($scope.parentId);
                    setStyle();
                    $element.on("mousedown", event => {
                        event.preventDefault();
                        startX = event.screenX - $scope.posX;
                        startY = event.screenY - $scope.posY;
                        $document.on("mousemove", mousemove);
                        $document.on("mouseup", mouseup);
                    });
                    function mousemove(event) {
                        const activePosX = event.screenX - startX;
                        const activePosY = event.screenY - startY;
                        const rightActive = $window.innerWidth - activePosX;
                        if (
                            activePosY < 0 ||
                            activePosY > $window.innerHeight - $element[0].offsetParent.clientHeight ||
                            rightActive < 0 ||
                            rightActive + $element[0].offsetParent.clientWidth > $window.innerWidth
                        ) {
                            return;
                        }

                        $scope.posY = event.screenY - startY;
                        $scope.posX = event.screenX - startX;
                        setStyle();
                    }
                    function mouseup() {
                        $document.off("mousemove", mousemove);
                        $document.off("mouseup", mouseup);
                    }

                    function setStyle() {
                        if ($scope.offStyle) {
                            return;
                        }
                        parentElement.style.top = $scope.posY + "px";
                        parentElement.style.right = $window.innerWidth - $scope.posX + "px";
                    }
                },
            ],
        };
    });
}
