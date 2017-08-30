/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var appBase_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../common/appBase\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * メインモジュール名
     */
    App.getAppModuleName = function () { return "StudentApp"; };
    /**
     * アプリケーション初期化処理
     */
    App.Init = function () {
        // デフォルトURLの設定
        this.getModule().config(["$urlRouterProvider", function ($urlRouterProvider) {
                $urlRouterProvider.otherwise("/login");
            }]);
        _super.Init.call(this);
    };
    return App;
}(appBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var authorizedPage_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/authorizedPage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var courseService_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../services/courseService\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(1);
var CoursePage = (function (_super) {
    __extends(CoursePage, _super);
    function CoursePage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    CoursePage.setOptions = function (options) {
        options.template = "\n<app-header title=\"$ctrl.courseService.course.name\" back-to=\"'auth.courselist'\" flex=\"none\"></app-header>\n<md-content flex=\"100\" class=\"height100\">\n    <ui-view></ui-view>\n</md-content>\n";
    };
    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    CoursePage.setInheritOptions = function (options) {
        _super.setInheritOptions.call(this, options);
        this.setResolveBindings(options, CoursePage.state);
    };
    return CoursePage;
}(authorizedPage_1.default));
/**
 * 登録コンポーネント名
 */
CoursePage.IID = "auth.course";
/**
 * ui-uiRouterにおけるstate
 */
CoursePage.state = {
    url: "/courses/:courseId",
    abstract: true,
    resolve: {
        courseService: [courseService_1.default.IID, "$transition$", function (courseService, $transition$) {
                return courseService.load($transition$.params().courseId).then(
                // success
                function (service) { return service; });
            }],
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoursePage;
CoursePage.register(app_1.default.getModule());


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var authorizedPage_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/authorizedPage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var courseService_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../services/courseService\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(1);
var CourseListPage = (function (_super) {
    __extends(CourseListPage, _super);
    function CourseListPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    CourseListPage.setOptions = function (options) {
        options.templateUrl = "./courses/courseList.html";
    };
    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    CourseListPage.setInheritOptions = function (options) {
        _super.setInheritOptions.call(this, options);
        this.setResolveBindings(options, CourseListPage.state);
    };
    return CourseListPage;
}(authorizedPage_1.default));
/**
 * 登録コンポーネント名
 */
CourseListPage.IID = "auth.courselist";
/**
 * ui-uiRouterにおけるstate
 */
CourseListPage.state = {
    url: "/courses",
    resolve: {
        courseList: [courseService_1.default.IID, function (courseService) {
                return courseService.getCourseList();
            }],
    },
};
CourseListPage.register(app_1.default.getModule());


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app_1 = __webpack_require__(1);
var course_1 = __webpack_require__(2);
var CourseModulesPage = (function (_super) {
    __extends(CourseModulesPage, _super);
    function CourseModulesPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    CourseModulesPage.setOptions = function (options) {
        options.templateUrl = "./courses/courseModules.html";
    };
    return CourseModulesPage;
}(course_1.default));
/**
 * 登録コンポーネント名
 */
CourseModulesPage.IID = "auth.course.modules";
/**
 * ui-uiRouterにおけるstate
 */
CourseModulesPage.state = {
    url: "/",
};
CourseModulesPage.register(app_1.default.getModule());


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ws_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(1);
var MywsPage = (function (_super) {
    __extends(MywsPage, _super);
    function MywsPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    MywsPage.setOptions = function (options) {
        options.templateUrl = "./ws/myws.html";
    };
    return MywsPage;
}(ws_1.default));
/**
 * 登録コンポーネント名
 */
MywsPage.IID = "auth.ws.myws";
/**
 * ui-uiRouterにおけるstate
 */
MywsPage.state = {
    url: "/myws",
};
MywsPage.register(app_1.default.getModule());


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ws_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(1);
var PeerWorksheetPage = (function (_super) {
    __extends(PeerWorksheetPage, _super);
    function PeerWorksheetPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    PeerWorksheetPage.setOptions = function (options) {
        options.templateUrl = "./ws/peerws.html";
    };
    /**
     * 初期化処理
     */
    PeerWorksheetPage.prototype.$onInit = function () {
        var user;
        for (var key in this.userGroups) {
            if (this.userGroups.hasOwnProperty(key)) {
                user = this.userGroups[key].find(function (value, index, obj) {
                    return value.student != null;
                });
                if (user) {
                    break;
                }
            }
        }
        this.selectedUserId = user.id;
    };
    Object.defineProperty(PeerWorksheetPage.prototype, "userGroups", {
        get: function () {
            return this.wsAssignmentService.ws.enableGroup ? this.wsAssignmentService.myUserGroups : this.wsAssignmentService.userGroups;
        },
        enumerable: true,
        configurable: true
    });
    PeerWorksheetPage.prototype.onUserClick = function (userId) {
        this.selectedUserId = userId;
    };
    return PeerWorksheetPage;
}(ws_1.default));
/**
 * 登録コンポーネント名
 */
PeerWorksheetPage.IID = "auth.ws.peerws";
/**
 * ui-uiRouterにおけるstate
 */
PeerWorksheetPage.state = {
    url: "/peerws",
};
PeerWorksheetPage.register(app_1.default.getModule());


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var index_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../components/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var index_2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../pages/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var index_3 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../services/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(1);
// アプリケーション初期化
app_1.default.Init();
// 共通サービス登録
index_3.default(app_1.default.getModule());
// 共通コンポーネント登録
index_1.default(app_1.default.getModule());
// 共通ページ登録
index_2.default(app_1.default.getModule());
// ページ登録
__webpack_require__(2);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map