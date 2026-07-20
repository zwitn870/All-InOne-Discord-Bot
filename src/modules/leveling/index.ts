import rankCmd from './commands/rank'
import leaderboardCmd from './commands/leaderboard'
import setlevelCmd from './commands/setlevel'
import levelroleCmd from './commands/levelrole'
import messageEvent from './events/message'

export const commands = [rankCmd, leaderboardCmd, setlevelCmd, levelroleCmd]
export const events = [messageEvent]
export const components = []
