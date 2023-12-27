import Player from '@vimeo/player';
import throttle from 'lodash.throttle';
import { LS_KEYS, readFromLS, writeToLS } from './common';

const iframe = document.querySelector('iframe');
const player = new Player(iframe, { id: 'vimeo-player' });

player.on(
  'timeupdate',
  throttle(e => {
    writeToLS(LS_KEYS.currentTime, e.seconds);
  }, 1000)
);

player.setCurrentTime(readFromLS(LS_KEYS.currentTime) ?? 0);
