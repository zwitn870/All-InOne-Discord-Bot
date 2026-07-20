import mongoose from 'mongoose'
import { setServers } from 'dns'
import { info, error } from '../shared/utils/logger'

const DB_NAME = 'discord-bot'

export async function connect(uri: string) {
  try {
    setServers(['8.8.8.8', '1.1.1.1'])
    mongoose.set('strictQuery', false)
    await mongoose.connect(uri, { dbName: DB_NAME })
    info('MongoDB connection established')
  } catch (err) {
    error('MongoDB connection failed', err)
    throw err
  }
}
