const APP_STATES = ['default', 'playing', 'settings'];
const MAX_MINUTES = 99;
const DEFAULT_TIME = 25 * 60;

let timerIntervalId = null;

function getElByDataId(dataId) {
  return document.querySelector(`[data-id="${dataId}"]`);
}

function setAppState(state) {
  if (APP_STATES.includes(state)) {
    getElByDataId('app').dataset.state = state;
  } else {
    console.error(`${state} is not included into APP_STATES`);
  }
}

function getTimerTimeByDataId(dataId) {
  const time = getElByDataId(dataId).innerHTML;
  const [minutes, seconds] = time.split(':');

  const m = Number(minutes);
  const s = Number(seconds);

  return [m, s];
}

function pauseTimer() {
  clearInterval(timerIntervalId);
}

function getStringTimerTime(m, s) {
  return `${m <= 9 ? `0${m}` : m}:${s <= 9 ? `0${s}` : s}`;
}

function setNewTimerTime({time, setDefaultTime}) {
  const newTime = setDefaultTime
    ? getStringTimerTime(
        Math.round(DEFAULT_TIME / 60),
        Math.round(DEFAULT_TIME % 60)
      )
    : time;

  getElByDataId('timerTime').innerHTML = newTime;
}

function playTimer() {
  setAppState('playing');

  timerIntervalId = setInterval(() => {
    const [m, s] = getTimerTimeByDataId('timerTime');

    let newTime =
      s === 0 && m === 0
        ? getStringTimerTime(
            Math.round(DEFAULT_TIME / 60),
            Math.round(DEFAULT_TIME % 60)
          )
        : '00:00';

    if (s === 0) {
      if (m === 0) {
        setAppState('default');

        pauseTimer();
      } else {
        newTime = getStringTimerTime(m - 1, 59);
      }
    } else {
      newTime = getStringTimerTime(m, s - 1);
    }

    setNewTimerTime({time: newTime});
  }, 1000);
}

getElByDataId('settings').addEventListener('click', () => {
  pauseTimer();

  setAppState('settings');
});

getElByDataId('start').addEventListener('click', () => {
  playTimer();
});

getElByDataId('pauseandcontinue').addEventListener('click', () => {
  pauseTimer();

  const pauseEl = getElByDataId('pauseandcontinue');

  if (pauseEl.dataset.state === 'onpause') {
    pauseEl.innerHTML = 'Pause';
    pauseEl.dataset.state = 'playing';

    playTimer();
  } else {
    pauseEl.innerHTML = 'Continue';
    pauseEl.dataset.state = 'onpause';
  }
});

getElByDataId('stop').addEventListener('click', () => {
  pauseTimer();

  setAppState('default');

  setNewTimerTime({setDefaultTime: true});
});

getElByDataId('cancel').addEventListener('click', () => {
  setAppState('default');
});

getElByDataId('save').addEventListener('click', () => {
  setNewTimerTime({time: getElByDataId('timerTimeForSet').innerHTML});

  setAppState('default');
});

getElByDataId('workTimeMinus').addEventListener('click', () => {
  const [m, s] = getTimerTimeByDataId('timerTimeForSet');

  if (m > 1) {
    getElByDataId('timerTimeForSet').innerHTML = getStringTimerTime(m - 1, 0);
  }
});

getElByDataId('workTimePlus').addEventListener('click', () => {
  const [m, s] = getTimerTimeByDataId('timerTimeForSet');

  if (m !== MAX_MINUTES) {
    getElByDataId('timerTimeForSet').innerHTML = getStringTimerTime(m + 1, 0);
  }
});

function startApp() {
  setNewTimerTime({setDefaultTime: true});
}

startApp();
