module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = __webpack_require__(17);
var Schema_1 = __webpack_require__(3);
var DBConnection;
var Database_ = /** @class */ (function () {
    function Database_() {
        this._collections = {};
        new Promise(function (resolve, reject) {
            mongodb.connect("mongodb://127.0.0.1:27017", function (err, res) {
                if (!err && res) {
                    DBConnection = res.db("iiitn");
                    exports.Database._collections = {
                        "guides": new Collection("guides"),
                        "tasks": new Collection("tasks"),
                        "user": new Collection("user"),
                        "keyvalue": new Collection("keyvalue")
                    };
                    return resolve(DBConnection);
                }
                return reject("Couldn't connect to database.");
            });
            setTimeout(function () {
                reject("Connection to database timedout.");
            }, 5000);
        });
    }
    Database_.prototype.collection = function (collection) {
        if (!exports.Database._collections[collection]) {
            console.error("Couldn't Access Database. For collection ", collection);
            process.exit();
        }
        return exports.Database._collections[collection];
    };
    return Database_;
}());
exports.Database = new Database_();
var Collection = /** @class */ (function () {
    function Collection(collection) {
        this.findOne = this.findOne.bind(this);
        this.getMany = this.getMany.bind(this);
        this.update = this.update.bind(this);
        this.insert = this.insert.bind(this);
        if (!DBConnection) {
            console.error("Couldn't establish database connection : ", collection);
            process.exit();
        }
        this._collection = DBConnection.collection(collection);
    }
    Collection.prototype.Get = function (collection) {
        return exports.Database.collection(collection);
    };
    Object.defineProperty(Collection.prototype, "raw", {
        get: function () {
            return this._collection;
        },
        enumerable: true,
        configurable: true
    });
    Collection.prototype.__map = function (res) {
        return {
            toArray: function () {
                return res.toArray().catch(function () {
                    return Promise.reject("Couldn't get records.");
                });
            },
            toObject: function () {
                var json = {};
                return res.toArray().then(function (arr) {
                    arr.map(function (elem) {
                        json[elem._id] = elem;
                    });
                    return json;
                }).catch(function () {
                    return Promise.reject("Couldn't get records");
                });
            }
        };
    };
    Collection.prototype.update = function (_id, data, schema, upsert) {
        if (!this._collection) {
            return Promise.reject("Couldn't get handle to collection.");
        }
        if (schema) {
            var error = Schema_1.Schema.validate(schema, data);
            if (error) {
                return Promise.reject(error);
            }
        }
        return this._collection.updateOne({ _id: _id }, data, {
            upsert: upsert
        }).catch(function () {
            return Promise.reject("Coudln't update record.");
        });
    };
    Collection.prototype.insert = function (data, schema) {
        if (!this._collection) {
            return Promise.reject("Couldn't get handle to collection.");
        }
        if (schema) {
            var error = Schema_1.Schema.validate(schema, data);
            if (error) {
                return Promise.reject(error);
            }
        }
        try {
            return this._collection.insertOne(data).catch(function () {
                return Promise.reject("Couldn't insert record");
            });
        }
        catch (e) {
            throw e;
        }
    };
    Collection.prototype.deleteById = function (_id) {
        if (!this._collection) {
            return Promise.reject("Couldn't get handle to collection.");
        }
        return this._collection.deleteOne({ _id: _id }).catch(function () {
            return Promise.reject("Couldn't delete record.");
        });
    };
    Collection.prototype.findOne = function (criteria, fields) {
        if (!this._collection) {
            return Promise.reject("Couldn't get handle to collection.");
        }
        return this._collection.findOne(criteria, { fields: fields }).catch(function () {
            return Promise.reject("Couldn't find Record.");
        });
    };
    Collection.prototype.getMany = function (criteria, fields) {
        return this.__map(this._collection.find(criteria, fields));
    };
    return Collection;
}());
exports.Collection = Collection;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("classui/Components/Form/Schema");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __webpack_require__(15);
exports.S_User = User_1.S_User;
exports.S_UserLogin = User_1.S_UserLogin;
var Question_1 = __webpack_require__(16);
exports.S_Question = Question_1.S_Question;
var Task_1 = __webpack_require__(5);
exports.S_Task = Task_1.S_Task;
exports.S_UserTask_Details = Task_1.S_UserTask_Details;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.S_FunctionDetails = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        tests: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    input: {
                        type: "array"
                    },
                    output: {}
                },
                required: ["input", "output"]
            }
        }
    },
    required: ["name", "tests"]
};
exports.S_Task = {
    oneOf: [
        {
            type: "object",
            properties: {
                type: {
                    const: "CANVAS2D"
                },
                title: {
                    type: "string"
                },
                question: {
                    type: "string"
                },
                resetCode: {
                    type: "string"
                }
            },
            required: ["type", "title", "question", "resetCode"]
        }, {
            type: "object",
            properties: {
                type: {
                    const: "TYPESCRIPT_EXPOUTPUT"
                },
                title: {
                    type: "string"
                },
                question: {
                    type: "string"
                },
                resetCode: {
                    type: "string"
                }
            },
            required: ["type", "title", "question"]
        }, {
            type: "object",
            properties: {
                type: {
                    const: "TYPESCRIPT_TESTCASE_TASK"
                },
                title: {
                    type: "string"
                },
                question: {
                    type: "string"
                },
                resetCode: {
                    type: "string"
                },
                funcDetails: exports.S_FunctionDetails
            },
            required: ["type", "title", "question", "resetCode", "funcDetails"]
        }
    ]
};
var validIDSchema = {
    type: "string",
    pattern: "^[a-zA-Z0-9-]{1,50}$"
};
exports.S_UserTask_Details = {
    oneOf: [
        {
            type: "object",
            properties: {
                _id: validIDSchema,
                type: {
                    const: "CANVAS2D"
                },
                code: {
                    type: "string"
                },
                result: {
                    enum: ["PENDING", "WRONG", "CAN_BE_IMPROVED", "GOOD", "PIXEL_PERFECT"]
                },
                comments: {
                    type: "string"
                }
            },
            required: ["type", "code", "result"]
        },
        {
            type: "object",
            properties: {
                _id: validIDSchema,
                type: {
                    const: "TYPESCRIPT_EXPOUTPUT"
                },
                code: {
                    type: "string"
                },
                result: {
                    enum: ["PENDING", "WRONG", "RIGHT"]
                }
            },
            required: ["type", "code", "result"]
        },
        {
            type: "object",
            properties: {
                _id: validIDSchema,
                type: {
                    const: "TYPESCRIPT_TESTCASE_TASK"
                },
                code: {
                    type: "string"
                },
                test_cases_passed: {
                    type: "number"
                }
            },
            required: ["type", "code", "test_cases_passed"]
        }
        // Other type of tasks can be implemented here.
    ]
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var es6_promise_1 = __webpack_require__(19);
var OrderedMapDatabase = /** @class */ (function () {
    function OrderedMapDatabase(collection, schema) {
        if (schema === void 0) { schema = {}; }
        var _this = this;
        this.collection = collection;
        this.collection.findOne({ _id: "config" }).then(function (config) {
            _this.order = config.order;
        }).catch(console.error);
        this.Tschema = schema;
    }
    OrderedMapDatabase.prototype.performAction = function (action) {
        var _this = this;
        switch (action.type) {
            case "INIT": {
                var data = void 0;
                return this.collection.getMany({}).toObject().then(function (list) {
                    action.state = {
                        map: _.omit(list, "config"),
                        order: list.config ? list.config.order : Object.keys(list)
                    };
                    return action;
                });
            }
            case "ADD": {
                var new_id_1 = uuid_1.v4();
                var data = action.value;
                data._id = new_id_1;
                return this.collection.insert(data, this.Tschema).then(function () {
                    return _this.collection.update("config", {
                        $push: { 'order': new_id_1 }
                    }).then(function () {
                        action._id = new_id_1;
                        return action;
                    });
                });
            }
            case "DELETE": {
                if (!this.order) {
                    return es6_promise_1.Promise.reject("COULDN'T GET ORDER!!!");
                }
                return this.collection.deleteById(action._id).then(function () {
                    var order = _this.order.filter(function (id) {
                        return action._id != id;
                    });
                    return _this.setOrder(order).then(function () {
                        return action;
                    });
                });
            }
            case "MODIFY": {
                return this.collection.update(action._id, action.value, this.Tschema).then(function () {
                    return action;
                });
            }
            case "REORDER": {
                return this.setOrder(action.order).then(function () {
                    return action;
                });
            }
        }
        console.error("UNKNOWN OPERATION : ", action);
        return es6_promise_1.Promise.reject("Unknown Operation ERROR.");
    };
    OrderedMapDatabase.prototype.setOrder = function (order) {
        var _this = this;
        return this.collection.update("config", {
            order: order
        }, undefined, true).then(function () {
            _this.order = order;
        }).catch(function () {
            console.error("Couldn't update order.");
            return es6_promise_1.Promise.reject("Couldn't update order.");
        });
    };
    return OrderedMapDatabase;
}());
exports.OrderedMapDatabase = OrderedMapDatabase;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(8);
var path = __webpack_require__(9);
var http = __webpack_require__(10);
var socketIO = __webpack_require__(11);
var Connection_1 = __webpack_require__(12);
var app = express();
// sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
// let privateKey = fs.readFileSync('./assets/certs/iiitnselfsigned.key', 'utf8');
// let certificate = fs.readFileSync('./assets/certs/iiitnselfsigned.crt', 'utf8');
var httpServer = new http.Server(app);
// let httpsServer = https.createServer({
// 	key: privateKey,
// 	cert: certificate
// }, app);
var io = socketIO(httpServer);
/*
app.get("/bundle/bundle.js", (req, res, next)=>{
    req.url = req.url + '.gz';
    console.log("Requested GZ");
    res.set('Content-Encoding', 'gzip');
    next();
});
*/
app.use(express.static("./"));
app.get('*', function (req, res) {
    res.sendFile(path.resolve('./index.html'));
});
var server = httpServer.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server started : " + host + " : " + port);
});
io.on('connection', function (socket) {
    // NEW CONNECTION.
    console.log("Connection...");
    new Connection_1.Connection(socket);
});


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var IIITN_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(22);
var _ = __webpack_require__(1);
var Connection = /** @class */ (function () {
    function Connection(socket) {
        this.socket = socket;
        this.initialize();
    }
    Connection.prototype.processRequest = function (request) {
        var _this = this;
        switch (request.type) {
            case "USER_LOGIN": {
                return IIITN_1.User.login(request.data).then(function (data) {
                    var ref = data.ref, loggedInData = __rest(data, ["ref"]);
                    _this.user = ref;
                    return loggedInData;
                });
            }
            case "REGISTER": {
                return IIITN_1.User.register(request.data);
            }
            case "STUDENTS": {
                return IIITN_1.User.getStudents();
            }
            case "PROFILE": {
                return IIITN_1.User.getProfile(request.data.userid);
            }
            case "TASK_ACTION": {
                return IIITN_1.Task.performAction(request.data);
            }
        }
        if (!this.user) {
            return Promise.reject("User should be authenticated first.");
        }
        switch (request.type) {
            // Authenticated actions goes here...
            case "USER_SAVE_TASK": {
                return this.user.saveTask(request.data);
            }
            case "GUIDE_ACTION": {
                if (_.get(request.data, "orderedMapAction.type") == "INIT")
                    return IIITN_1.Guide.performAction(request.data);
            }
        }
        // Admin actions goes here...
        if (this.user.userid != "admin") {
            return Promise.reject("User should be an admin.");
        }
        switch (request.type) {
            case "GUIDE_ACTION": {
                return IIITN_1.Guide.performAction(request.data);
            }
        }
        return Promise.reject("Request type " + request.type + " not found.");
    };
    Connection.prototype.initialize = function () {
        var _this = this;
        // Queue requests one after the other.
        var requests = [];
        var processInProgress = false;
        var functionQueue = function () {
            if (processInProgress) {
                return;
            }
            processInProgress = true;
            if (requests.length == 0) {
                processInProgress = false;
                return;
            }
            var request = requests[0];
            requests = _.drop(requests);
            _this.processRequest(request).then(function (data) {
                var response = {
                    data: data
                };
                _this.socket.emit(Utils_1.getResponseID(request.id), response);
                processInProgress = false;
                functionQueue();
            }).catch(function (error) {
                var response = {
                    error: error
                };
                _this.socket.emit(Utils_1.getResponseID(request.id), response);
                processInProgress = false;
                functionQueue();
            });
        };
        this.socket.on('request', function (request) {
            // Process request and send response in data.
            requests.push(request);
            functionQueue();
        });
    };
    return Connection;
}());
exports.Connection = Connection;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __webpack_require__(14);
exports.User = User_1.User;
var Task_1 = __webpack_require__(18);
exports.Task = Task_1.Task;
var _KeyValue_1 = __webpack_require__(20);
exports.KeyValue = _KeyValue_1.KeyValue;
var Guide_1 = __webpack_require__(21);
exports.Guide = Guide_1.Guide;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __webpack_require__(2);
var Schema_1 = __webpack_require__(3);
var index_1 = __webpack_require__(4);
var Task_1 = __webpack_require__(5);
var Database_1 = __webpack_require__(0);
var _ = __webpack_require__(1);
var User = /** @class */ (function () {
    function User(userid) {
        this.userid = userid;
    }
    User.register = function (user) {
        // Add an empty object for tasks.
        user.tasks = {};
        user.secretKey = uuid_1.v4();
        return Database_1.Database.collection("user").insert(user, index_1.S_User).then(function (res) {
            return Promise.resolve("User " + user._id + " successfully registered.");
        }).catch(function (e) { return Promise.reject("User already exists."); });
    };
    User.login = function (data) {
        return Database_1.Database.collection("user").findOne({ _id: data.userid }).then(function (user) {
            if (!user) {
                return Promise.reject("User Not Found.");
            }
            if ((user.password == data.password) || (user.secretKey == data.secretKey)) {
                return Promise.resolve({
                    ref: new User(data.userid),
                    secretKey: user.secretKey,
                    tasks: user.tasks
                });
            }
            return Promise.reject("Invalid password.");
        });
    };
    User.getStudents = function () {
        return Database_1.Database.collection("user").getMany({}).toArray().then(function (data) {
            return data.map(function (obj) { return _.omit(obj, ["password", "secretKey"]); });
        })
            .catch(function () { throw "Couldn't get students."; });
    };
    User.getProfile = function (userid) {
        return Database_1.Database.collection("user").findOne({ _id: userid }).then(function (res) {
            if (!res) {
                return Promise.reject("User Details not found.");
            }
            return Promise.resolve(res);
        }).catch(function () {
            return Promise.reject("Error getting profile details.");
        });
    };
    User.prototype.saveTask = function (saveTaskAction) {
        // Default data if any.
        saveTaskAction.taskDetails = __assign({}, saveTaskAction.taskDetails);
        var error = Schema_1.Schema.validate(Task_1.S_UserTask_Details, saveTaskAction.taskDetails);
        if (error) {
            return Promise.reject(error);
        }
        return Database_1.Database.collection("user").raw.updateOne({ _id: this.userid }, {
            $set: (_a = {},
                _a["tasks." + saveTaskAction.taskDetails._id] = saveTaskAction.taskDetails,
                _a)
        }).then(function () {
            return Promise.resolve(saveTaskAction);
        }).catch(function () {
            return Promise.reject("Couldn't save.");
        });
        var _a;
    };
    return User;
}());
exports.User = User;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.S_User = {
    type: "object",
    properties: {
        _id: {
            type: "string",
            pattern: "(^N\\d{6}$)|(admin)"
        },
        name: {
            type: "string"
        },
        email: {
            type: "string",
            format: "email"
        },
        password: {
            type: "string",
            minLength: 5
        },
        batch: {
            enum: ["E1", "E2", "E3", "E4"]
        },
        branch: {
            enum: ["CSE", "MME", "ECE", "MECH", "CHEMICAL"]
        },
        role: {
            enum: ["admin", "student"],
            default: "student"
        }
    },
    required: ["_id", "email", "password", "batch", "branch"]
};
exports.S_UserLogin = {
    type: "object",
    properties: {
        userid: exports.S_User.properties._id,
        password: exports.S_User.properties.password
    },
    required: ["userid", "password"]
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.S_Question = {
    type: "object",
    properties: {
        title: {
            type: "string"
        },
        description: {
            type: "string"
        }
    }
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("mongodb");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(4);
var OrderedMapDatabase_1 = __webpack_require__(6);
var Database_1 = __webpack_require__(0);
var _Task = /** @class */ (function () {
    function _Task() {
    }
    // Update task. One action should be there.
    _Task.prototype.performAction = function (action) {
        if (!this.orderedMapDatabase) {
            this.orderedMapDatabase = new OrderedMapDatabase_1.OrderedMapDatabase(Database_1.Database.collection("tasks"), index_1.S_Task);
        }
        var status = this.orderedMapDatabase.performAction(action.orderedMapAction);
        return status.then(function (omAction) {
            action.orderedMapAction = omAction;
            return Promise.resolve(action);
        }).catch(function (error) {
            console.log(error);
            return Promise.reject("Couldn't perform action.");
        });
    };
    return _Task;
}());
exports._Task = _Task;
exports.Task = new _Task();


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("es6-promise");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Database_1 = __webpack_require__(0);
var KeyValue = /** @class */ (function () {
    function KeyValue() {
    }
    // Update task. One action should be there.
    KeyValue.set = function (key, data) {
        return Database_1.Database.collection("keyvalue").raw.update({ _id: key }, {
            data: data
        }, {
            upsert: true
        });
    };
    KeyValue.get = function (key) {
        return Database_1.Database.collection("keyvalue").findOne({ _id: key }).then(function (data) {
            if (data) {
                return data.data;
            }
            return null;
        });
    };
    return KeyValue;
}());
exports.KeyValue = KeyValue;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OrderedMapDatabase_1 = __webpack_require__(6);
var Database_1 = __webpack_require__(0);
var _Guide = /** @class */ (function () {
    function _Guide() {
    }
    // Update task. One action should be there.
    _Guide.prototype.performAction = function (action) {
        if (!this.orderedMapDatabase) {
            this.orderedMapDatabase = new OrderedMapDatabase_1.OrderedMapDatabase(Database_1.Database.collection("guides"));
        }
        return this.orderedMapDatabase.performAction(action.orderedMapAction).then(function (omAction) {
            action.orderedMapAction = omAction;
            return action;
        }).catch(function (error) {
            return Promise.reject("Couldn't perform action.");
        });
    };
    return _Guide;
}());
exports.Guide = new _Guide();


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseID = function (req_id) {
    return "response_" + req_id;
};


/***/ })
/******/ ]);