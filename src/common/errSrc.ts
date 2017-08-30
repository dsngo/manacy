/**
 * Errorだった場合、代替画像を表示されるDirective
 * http://stackoverflow.com/questions/16310298/if-a-ngsrc-path-resolves-to-a-404-is-there-a-way-to-fallback-to-a-default
 */
export default function register(app: ng.IModule) {
    app.directive("errSrc", () => {
        return {
            link: (scope, element, attrs) => {
                element.bind("error", () => {
                    if (attrs["src"] !== attrs["errSrc"]) {
                        attrs.$set("src", attrs["errSrc"]);
                    }
                });
            },
        };
    });
}
