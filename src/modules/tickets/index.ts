import setupCmd from './commands/setup'
import closeCmd from './commands/close'
import claimCmd from './commands/claim'
import addCmd from './commands/add'
import removeCmd from './commands/remove'
import renameCmd from './commands/rename'
import createComponent from './components/ticketCreate'
import { closeComponent, claimComponent } from './components/ticketActions'

export const commands = [setupCmd, closeCmd, claimCmd, addCmd, removeCmd, renameCmd]
export const events = []
export const components = [createComponent, closeComponent, claimComponent]
