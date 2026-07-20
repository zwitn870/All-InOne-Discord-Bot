import balanceCmd from './commands/balance'
import dailyCmd from './commands/daily'
import weeklyCmd from './commands/weekly'
import giveCmd from './commands/give'
import shopCmd from './commands/shop'
import buyCmd from './commands/buy'
import inventoryCmd from './commands/inventory'
import workCmd from './commands/work'
import gambleCmd from './commands/gamble'
import robCmd from './commands/rob'
import coinflipCmd from './commands/coinflip'
import diceCmd from './commands/dice'
import shopComponent from './components/shop'

export const commands = [balanceCmd, dailyCmd, weeklyCmd, giveCmd, shopCmd, buyCmd, inventoryCmd, workCmd, gambleCmd, robCmd, coinflipCmd, diceCmd]
export const events = []
export const components = [shopComponent]
