import initializeBasicAuth from 'nextjs-basic-auth'
import type { IncomingMessage, ServerResponse } from 'http'
 
const users = [
  { user: 'guest', password: process.env.BASIC_AUTH_PASSWORD! }
]
 
const basicAuthCheck = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  await initializeBasicAuth({ users })(req, res)
}
 
export default basicAuthCheck