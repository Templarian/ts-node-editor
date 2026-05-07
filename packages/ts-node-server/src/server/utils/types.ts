import { IncomingMessage, ServerResponse } from 'http';

export type Req = IncomingMessage;
export type Res = ServerResponse<IncomingMessage> & { req: IncomingMessage };
