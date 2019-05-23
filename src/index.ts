import * as http from "http";
import { AppMiddleware, Handler, ICtx, Routex } from "routex";
import * as ws from "ws";

type SocketHandler = (socket: ws, ctx: ICtx) => void;

export default function(options?: ws.ServerOptions): AppMiddleware {
  return (routex: Routex) => ({
    initializeServer: (server: http.Server) => {
      const wss = new ws.Server({ ...options, server });

      wss.on("connection", async (socket, req) => {
        // Create a dummy response to run as a request in Routex
        const dummyRes = new http.ServerResponse(req);

        dummyRes.writeHead = (statusCode: number) => {
          if (statusCode > 200) {
            socket.close();
          }
          return dummyRes;
        };

        const ctx = await routex.handler(req, dummyRes);

        // Check if the request was intercepted/handler by a socket handler
        const handler = ctx.data._socketHandler;

        if (!handler) {
          socket.close();
          return;
        }

        // Call socket handler
        handler(socket, ctx, wss);
      });
    }
  });
}

export function socketHandler(handler: SocketHandler): Handler {
  return (ctx: ICtx) => {
    ctx.data._socketHandler = handler;
  };
}
