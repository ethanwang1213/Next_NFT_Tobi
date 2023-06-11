import type { IncomingMessage, ServerResponse } from "http"

declare module "basic-auth" {
  export default function basicAuthCheck(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
