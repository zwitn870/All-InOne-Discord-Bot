import playCmd from './commands/play'
import skipCmd from './commands/skip'
import stopCmd from './commands/stop'
import queueCmd from './commands/queue'
import nowplayingCmd from './commands/nowplaying'
import pauseCmd from './commands/pause'
import resumeCmd from './commands/resume'
import volumeCmd from './commands/volume'
import loopCmd from './commands/loop'
import shuffleCmd from './commands/shuffle'
import removeCmd from './commands/remove'
import playlistCmd from './commands/playlist'
import seekCmd from './commands/seek'

export const commands = [playCmd, skipCmd, stopCmd, queueCmd, nowplayingCmd, pauseCmd, resumeCmd, volumeCmd, loopCmd, shuffleCmd, removeCmd, playlistCmd, seekCmd]
export const events = []
export const components = []
