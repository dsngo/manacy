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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
    App.getAppModuleName = function () { return "TeacherApp"; };
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
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var authorizedPage_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/authorizedPage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var courseService_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../services/courseService\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(0);
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
                return courseService.load($transition$.params().courseId).then(function (service) { return service; });
            }],
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoursePage;
CoursePage.register(app_1.default.getModule());


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var authorizedPage_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/authorizedPage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var courseService_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../services/courseService\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(0);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app_1 = __webpack_require__(0);
var course_1 = __webpack_require__(3);
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ws_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var userService_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../services/userService\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var wsEditorService_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../services/wsEditorService\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(0);
var WsEditorPage = (function (_super) {
    __extends(WsEditorPage, _super);
    function WsEditorPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isSettingsOpen = true;
        return _this;
    }
    /**
     * コンポーネントオプション
     */
    WsEditorPage.setOptions = function (options) {
        options.templateUrl = "./ws/wsEditor.html";
    };
    Object.defineProperty(WsEditorPage.prototype, "dummyStudentOwner", {
        get: function () {
            return userService_1.default.DummyStudentOwner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WsEditorPage.prototype, "dummyStudentSameGroup", {
        get: function () {
            return userService_1.default.DummyStudentSameGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WsEditorPage.prototype, "dummyStudentSameCourse", {
        get: function () {
            return userService_1.default.DummyStudentSameCourse;
        },
        enumerable: true,
        configurable: true
    });
    return WsEditorPage;
}(ws_1.default));
/**
 * 登録コンポーネント名
 */
WsEditorPage.IID = "auth.ws.editor";
/**
 * ui-uiRouterにおけるstate
 */
WsEditorPage.state = {
    url: "/editor",
    resolve: {
        wsAssignmentService: [wsEditorService_1.default.IID, function (wsEditorService) {
                return wsEditorService.load().then(function (service) { return service; });
            }],
    },
};
WsEditorPage.register(app_1.default.getModule());


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ws_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(0);
var WsElementsPage = (function (_super) {
    __extends(WsElementsPage, _super);
    function WsElementsPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    WsElementsPage.setOptions = function (options) {
        options.templateUrl = "./ws/wsElements.html";
    };
    WsElementsPage.prototype.$onInit = function () {
        this.userGroups = this.wsAssignmentService.userGroups;
    };
    WsElementsPage.prototype.onElementSelected = function (elementId) {
        this.selectedElementId = elementId;
    };
    Object.defineProperty(WsElementsPage.prototype, "selectedElement", {
        get: function () {
            return this.wsAssignmentService.elements[this.selectedElementId];
        },
        enumerable: true,
        configurable: true
    });
    return WsElementsPage;
}(ws_1.default));
/**
 * 登録コンポーネント名
 */
WsElementsPage.IID = "auth.ws.elements";
/**
 * ui-uiRouterにおけるstate
 */
WsElementsPage.state = {
    url: "/elements",
};
WsElementsPage.register(app_1.default.getModule());


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ws_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../pages/ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(0);
var WsStudentsPage = (function (_super) {
    __extends(WsStudentsPage, _super);
    function WsStudentsPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * コンポーネントオプション
     */
    WsStudentsPage.setOptions = function (options) {
        options.templateUrl = "./ws/wsStudents.html";
    };
    /**
     * 初期化処理
     */
    WsStudentsPage.prototype.$onInit = function () {
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
    Object.defineProperty(WsStudentsPage.prototype, "userGroups", {
        get: function () {
            return this.wsAssignmentService.userGroups;
        },
        enumerable: true,
        configurable: true
    });
    WsStudentsPage.prototype.onUserClick = function (userId) {
        this.selectedUserId = userId;
    };
    return WsStudentsPage;
}(ws_1.default));
/**
 * 登録コンポーネント名
 */
WsStudentsPage.IID = "auth.ws.students";
/**
 * ui-uiRouterにおけるstate
 */
WsStudentsPage.state = {
    url: "/students",
};
WsStudentsPage.register(app_1.default.getModule());


/***/ }),
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var index_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../components/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var index_2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../pages/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var index_3 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../services/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var app_1 = __webpack_require__(0);
// アプリケーション初期化
app_1.default.Init();
// 共通サービス登録
index_3.default(app_1.default.getModule());
// 共通コンポーネント登録
index_1.default(app_1.default.getModule());
// 共通ページ登録
index_2.default(app_1.default.getModule());
// ページ登録
__webpack_require__(3);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map