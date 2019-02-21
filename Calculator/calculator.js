'use strict';
{
  let display = 0;
  let log = 0;
  let limit = 9;
  let limit2 = 30;

  const createEvents = () => {
    let controls = document.getElementsByClassName('control');
    controls = Array.from(controls);
    // controls = Object.values(controls)
    controls.forEach(function (element) {
      element.addEventListener('click', action);
    });
  };

  const action = (e) => {
    const option = e.target.innerText;
    let prev = document.getElementById('main').innerText;
    if (prev.length > limit || log.length > limit2) {
      limitExceeded();
    } else if (option === '=') {
      makeOperation(option);
    } else if (option === 'AC') {
      allClear();
    } else if (option === 'CE') {
      clear();
    } else if (option === '.') {
      if (prev[prev.length - 1] !== '.') {
        addComma(prev);
      }
    } else if (Number.isNaN(parseFloat(option))) {
      if (!Number.isNaN(parseInt(log[log.length - 1]))) {
        if (display === 0 && option === '-') {
          addNumber(option, prev);
        } else if (option === '=') {
          makeOperation(option);
        } else {
          addNumber(option, prev);
        }
      }
    } else {
      if (option !== '0' || display !== 0) {
        addNumber(option, prev);
      }
    }
  };

  const limitExceeded = () => {
    display = 0;
    log = 0;
    updateView(display, 'DIGIT LIMIT');
  };

  const clear = () => {
    display = 0;
    updateView(display, log);
  };

  const allClear = () => {
    display = 0;
    log = 0;
    updateView(display, log);
  };

  const addNumber = (num, prev) => {
    if (Number.isNaN(parseFloat(num))) {
      display = num;
    } else if (prev !== '0') {
      display = prev + num;
    } else display = num;
    if (log !== 0) {
      log += num;
    } else log = num;
    updateView(display, log);
  };

  const addComma = () => {
    display += '.';
    log += '.';
    updateView(display, log);
  };

  const makeOperation = () => {
    log = log.replace('\u00F7', '/');
    log = log.replace('\u00D7', '*');
    updateView(eval(log), log);
  };

  const updateView = (result, history) => {
    if (String(display).length < limit + 1) {
      document.getElementById('main').innerText = result;
      document.getElementById('log').innerText = history;
    } else {
      limitExceeded();
    }
  };

  window.addEventListener('load', createEvents);
}
