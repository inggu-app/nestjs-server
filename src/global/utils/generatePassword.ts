import * as crypto from 'crypto'

export default function generatePassword(length?: number) {
  return crypto.randomBytes(length || 15).toString('hex')
}
