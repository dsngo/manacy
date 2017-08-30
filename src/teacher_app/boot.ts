"use strict";

import registerComponents from "../components/index";
import registerDirectives from "../directives/index";
import registerPages from "../pages/index";
import registerServices from "../services/index";
import app from "./app";

// アプリケーション初期化
app.Init();

// 共通サービス登録
registerServices(app.getModule());

// 共通コンポーネント登録
registerComponents(app.getModule());

// 共通ページ登録
registerPages(app.getModule());

// 共通ディレクティブ登録
registerDirectives(app.getModule());

// ページ登録
import "./albums/albums";
import "./assignment/assignment";
import "./assignment/newAssignment";
import "./assignment/settings/assignmentEditProperties";
import "./assignment/settings/assignmentProperties";
import "./assignment/settings/assignmentSettings";
import "./entries/entries";
import "./menu/menu";
import "./menu/menu1";
import "./menu/menu1-1";
import "./menu/menu2";
import "./menu/menu3";
import "./templates/templates";
import "./ws/wsElements";
import "./ws/wsStudents";
import "./wslist/wsList";
import "./wslist/wslistDraft";
import "./wslist/wslistMine";
import "./wslist/wslistToday";
import "./wssettings/newWs";
import "./wssettings/wsEditor";
import "./wssettings/wsEditProperties";
import "./wssettings/wsPreview";
import "./wssettings/wsProperties";
import "./wssettings/wssettings";
