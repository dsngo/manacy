import AppPanelBase from "./appPanelBase";

export default class AppFullScreenPanel extends AppPanelBase {

    public static newConfig(): ng.material.IPanelConfig {
        const config = super.newConfig();
        config.fullscreen = true;
        config.escapeToClose = true;
        config.trapFocus = true;
        config.disableParentScroll = true;
        return config;
    }

}
