// 共通コンポーネント
import AppAvatar from "./appAvatar";
import AppBox from "./appBox";
import AppDrawing from "./appDrawing";
import AppHeader from "./appHeader";
import AppSearchText from "./appSearchText";
import AppSideNav from "./appSideNav";

// 画面テンプレート
import MenuView from "./view/menuView";
import View from "./view/view";
import ViewBackTo from "./view/viewBackTo";
import ViewMenu from "./view/viewMenu";

// アルバム関連
import AlbumsView from "./albums/albumsView";
import AlbumsNav from "./albums/albumsNav";

// 旧バージョン
// import WsItemAnnotation from "./ws/wsItemAnnotation";
// import WsItemBlock from "./ws/wsItemBlock";
// import WsItemComment from "./ws/wsItemComment";
// import WsItemDiscussion from "./ws/wsItemDiscussion";
// import WsItemEntry from "./ws/wsItemEntry";
// import WsItemSingleEntry from "./ws/wsItemSingleEntry";

// カキコミ関連
import EntriesNav from "./entries/entriesNav";
import EntriesView from "./entries/entriesView";

// テンプレート関連
import TemplatesView from "./templates/templatesView";

// ユーザ関連
import UserSettings from "./user/UserSettings";

// ワークシート関連
import WsElement from "./ws/wsElement";
import WsElementNav from "./ws/wsElementNav";
import WsElementView from "./ws/wsElementView";
import WsEntry from "./ws/wsEntry";
import WsEntryBasic from "./ws/wsEntryBasic";
import WsEntryBasicInput from "./ws/wsEntryBasicInput";
import WsEntryChat from "./ws/wsEntryChat";
import WsEntryDiscussion from "./ws/wsEntryDiscussion";
import WsEntryHeader from "./ws/wsEntryHeader";
import WsEntryMedia from "./ws/wsEntryMedia";
import WsEntryMediaAudio from "./ws/wsEntryMediaAudio";
import WsEntryMediaFile from "./ws/WsEntryMediaFile";
import WsEntryMediaImage from "./ws/wsEntryMediaImage";
import WsEntryMediaVideo from "./ws/wsEntryMediaVideo";
import WsEntryRubric from "./ws/wsEntryRubric";
import WsEntrySelection from "./ws/wsEntrySelection";
import WsEntrySelectionInput from "./ws/wsEntrySelectionInput";
import WsListNav from "./ws/WsListNav";
import WsListView from "./ws/WsListView";
import WsOwnerView from "./ws/wsOwnerView";
import WsSaveBar from "./ws/wsSaveBar";
import WsUsersNav from "./ws/wsUsersNav";

// ワークシートエディタ
import WsAddElementButton from "./wsEditor/wsAddElementButton";
import WsEditorView from "./wsEditor/wsEditorView";
import WsElementEditor from "./wsEditor/wsElementEditor";
import WsElementPlacement from "./wsEditor/wsElementPlacement";
import WsElementSettings from "./wsEditor/wsElementSettings";
import WsElementSettingsBasic from "./wsEditor/wsElementSettingsBasic";
import WsElementSettingsRubric from "./wsEditor/wsElementSettingsRubric";
import WsElementSettingsSelection from "./wsEditor/wsElementSettingsSelection";
import WsOriginCategoryNav from "./wsEditor/wsOriginCategoryNav";
import WsOriginList from "./wsEditor/wsOriginList";
import WsSelectOrigins from "./wsEditor/wsSelectOrigins";
import WsSettings from "./wsEditor/wsSettings";

// ワークシート準備
import WsAssignmentList from "./wslist/wsAssignmentList";
import WsList from "./wslist/wsList";

export default function registerComponents(app: ng.IModule) {
    // WsItemEntry.register(app);
    // WsItemBlock.register(app);
    // WsItemSingleEntry.register(app);
    // WsItemComment.register(app);
    // WsItemAnnotation.register(app);
    // WsItemDiscussion.register(app);

    // 共通コンポーネント
    AppAvatar.register(app);
    AppBox.register(app);
    AppDrawing.register(app);
    AppHeader.register(app);
    AppSearchText.register(app);
    AppSideNav.register(app);

    // 画面テンプレート
    View.register(app);
    MenuView.register(app);
    ViewBackTo.register(app);
    ViewMenu.register(app);

    // アルバム関連
    AlbumsView.register(app);
    AlbumsNav.register(app);

    // カキコミ関連
    EntriesNav.register(app);
    EntriesView.register(app);

    // テンプレート関連
    TemplatesView.register(app);

    // ユーザ関連
    UserSettings.register(app);

    // ワークシート関連
    WsListNav.register(app);
    WsListView.register(app);
    WsOwnerView.register(app);
    WsElement.register(app);
    WsEntry.register(app);
    WsEntryBasic.register(app);
    WsEntryBasicInput.register(app);
    WsEntryChat.register(app);
    WsEntryDiscussion.register(app);
    WsEntryHeader.register(app);
    WsEntryMedia.register(app);
    WsEntryMediaAudio.register(app);
    WsEntryMediaFile.register(app);
    WsEntryMediaImage.register(app);
    WsEntryMediaVideo.register(app);
    WsEntryRubric.register(app);
    WsEntrySelection.register(app);
    WsEntrySelectionInput.register(app);
    WsSaveBar.register(app);
    WsUsersNav.register(app);
    WsElementView.register(app);
    WsElementNav.register(app);

    // ワークシートエディタ
    WsEditorView.register(app);
    WsElementEditor.register(app);
    WsAddElementButton.register(app);
    WsElementPlacement.register(app);
    WsElementSettings.register(app);
    WsElementSettingsBasic.register(app);
    WsElementSettingsRubric.register(app);
    WsElementSettingsSelection.register(app);
    // WsSelectOrigins.register(app);    //mdDialogがcomponet対応したらcomponentにする
    WsOriginCategoryNav.register(app);
    WsOriginList.register(app);
    WsSettings.register(app);

    // ワークシート準備
    WsAssignmentList.register(app);
    WsList.register(app);
}
