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
/******/ 	return __webpack_require__(__webpack_require__.s = 243);
/******/ })
/************************************************************************/
/******/ ({

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var CACHE_NAME = "iiitncache";
var urlsToCache = [
    // Cache web pages.
    "/",
    "/playground",
    "/typescript",
    "/login",
    "/2dplayground",
    // Cache webpage resources.
    "/assets/vs/loader.js",
    "/assets/Inconsolata.css",
    "/assets/Draft.css",
    "/assets/canvas2d/global.js",
    "/bundle/classui.css",
    "/bundle/bundle.js"
];
// Install Event.
self.addEventListener("install", function (event) {
    if (caches.has(CACHE_NAME)) {
        console.log("Deleted old cache...");
        caches.delete(CACHE_NAME);
    }
    // Perform install steps.
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(urlsToCache);
    }));
    console.log("New Cache : " + CACHE_NAME);
    self.skipWaiting();
});
// Activation Event.
self.addEventListener("activate", function (event) {
});
// Cache fetch requests.
self.addEventListener("fetch", function (event) {
    var url = new URL(event.request.url);
    if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/bundle/")) {
        event.respondWith(caches.match(event.request).then(function (response) {
            var fetchRequest = fetch(event.request.clone()).then(function (response) {
                var cacheresponse = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, cacheresponse);
                });
                return response;
            }).catch(function () { }); // Ignore fetch error.
            if (response) {
                return response;
            }
            return fetchRequest;
        }));
        return;
    }
    else {
        event.respondWith(caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(function () { }); // Ignore fetch error.
        }));
    }
});


/***/ })

/******/ });
//# sourceMappingURL=SW.js.map