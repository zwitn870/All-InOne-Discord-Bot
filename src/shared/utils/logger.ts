const PREFIX = '[All-InOne]'

export function info(...args: unknown[]) {
  console.log(`${PREFIX} [INFO]`, new Date().toISOString(), ...args)
}

export function warn(...args: unknown[]) {
  console.warn(`${PREFIX} [WARN]`, new Date().toISOString(), ...args)
}

export function error(...args: unknown[]) {
  console.error(`${PREFIX} [ERROR]`, new Date().toISOString(), ...args)
}
