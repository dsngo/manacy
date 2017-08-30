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
import "./entries/entries";
import "./menu/menu";
import "./ws/myws";
import "./ws/peerws";
import "./ws/wsList";
