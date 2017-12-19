"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("@cycle/dom");
var time_1 = require("@cycle/time");
var run_1 = require("@cycle/run");
var xstream_1 = require("xstream");
function main(sources) {
    return {
        DOM: xstream_1.Stream.of(dom_1.div('hello world'))
    };
}
var drivers = {
    DOM: dom_1.makeDOMDriver(document.body),
    Time: time_1.timeDriver
};
run_1.run(main, drivers);
