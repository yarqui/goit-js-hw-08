import Player from '@vimeo/player';
import throttle from 'lodash.throttle';

const LS_KEYS = {
  currentTime: 'videoplayer-current-time',
};

const iframe = document.querySelector('iframe');
const player = new Player(iframe, { id: 'vimeo-player' });

const readFromLS = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    throw new Error(error.message);
  }
};

const writeToLS = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

player.on(
  'timeupdate',
  throttle(e => {
    writeToLS(LS_KEYS.currentTime, e.seconds);
  }, 1000)
);

player.setCurrentTime(readFromLS(LS_KEYS.currentTime) ?? 0);
