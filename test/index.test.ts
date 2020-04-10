import { Routex } from "routex";
import * as ws from "ws";

import websocket, { socketHandler } from "../src";

it("Connects and echo", async () => {
  const app = new Routex();

  app.appMiddleware(websocket());

  app.get(
    "/",
    socketHandler((socket) => {
      socket.send("START");

      socket.on("message", (data) => {
        socket.send(data);
      });
    })
  );

  const { close, port } = await app.listen();

  const client = new ws(`ws://localhost:${port}`);

  const messages: string[] = [];

  client.on("message", (message) => {
    messages.push(message as string);
  });

  // Wait to connect
  await new Promise((resolve) => {
    client.on("open", () => {
      resolve();
    });
  });

  client.send("TEST");

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(messages[0]).toBe("START");
  expect(messages[1]).toBe("TEST");

  client.close();

  await close();
});

// it("Connects to no handler", async () => {
//   const app = new Routex();
//
//   app.appMiddleware(websocket());
//
//   const { close, port } = await app.listen();
//
//   const client = new ws(`ws://localhost:${port}`);
//
//   let closed = false;
//   client.on("close", () => {
//     closed = true;
//   });
//
//   // Wait to connect
//   await new Promise((resolve) => {
//     client.on("open", () => {
//       resolve();
//     });
//   });
//
//   // Wait a bit
//   await new Promise((resolve) => setTimeout(resolve, 100));
//
//   expect(closed).toBeTruthy();
//
//   client.close();
//
//   await close();
// });
