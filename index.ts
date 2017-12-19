import { makeDOMDriver } from '@cycle/dom';
import { timeDriver } from '@cycle/time';
import { setup } from '@cycle/run';
import { Stream } from 'xstream';
const { rerunner, restartable } = require('cycle-restart');

import { main } from './app';

const makeDrivers = () => ({
  DOM: restartable(makeDOMDriver(document.body), {pauseSinksWhileReplaying: false}),
  Time: timeDriver
});

const rerun = rerunner(setup, makeDrivers);

rerun(main);

if ((module as any).hot) {
  (module as any).hot.accept('./app', () => {
    const newMain = require('./app').main;

    rerun(newMain);
  });
}
