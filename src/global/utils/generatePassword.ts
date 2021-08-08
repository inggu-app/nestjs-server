import * as crypto from 'crypto'

export default function generatePassword() {
  return crypto.randomBytes(15).toString('hex')
}
