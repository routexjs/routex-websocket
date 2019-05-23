# Routex WebSocket [![npm](https://img.shields.io/npm/v/@routex/websocket.svg)](https://www.npmjs.com/package/@routex/websocket) [![Travis CI](https://img.shields.io/travis/com/Cretezy/routex-websocket.svg)](https://travis-ci.com/Cretezy/routex-websocket) [![Codecov](https://img.shields.io/codecov/c/github/Cretezy/routex-websocket.svg)](https://codecov.io/gh/Cretezy/routex-websocket)

WebSockets for [Routex](https://www.npmjs.com/package/routex).

Based on [ws](https://www.npmjs.com/package/ws).

## Usage

Install:

```bash
yarn add @routex/websocket
# or
npm add @routex/websocket
```

Setup your app:

```js
const { Routex, TextBody } = require("routex");
const websocket = require("@routex/websocket");

const port = process.env.PORT || 3000;
const app = new Routex();

app.appMiddleware(websocket());

// Must be a GET request.
app.get(
  "/",
  websocket.socketHandler(socket => {
    // Echo server
    socket.on("message", data => {
      socket.send("You said: " + data);
    });
  })
);

app.listen(port).then(() => console.log(`Listening on ${port}`));
```

### Options

You can pass any [server option from ws](https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketserveroptions-callback) (except `server`).

```js
app.appMiddleware(
  websocket({
    backlog: 10, // he maximum length of the queue of pending connections
    perMessageDeflate: true, // Enable/disable permessage-deflate
    maxPayload: 1024 * 1024 // The maximum allowed message size in bytes
    // ...
  })
);
```

### Handler

The `socketHandler` accepts a socket handler, which is passed in a [WebSocket](https://github.com/websockets/ws/blob/HEAD/doc/ws.md#class-websocket) and `ctx`.

```js
app.get(
  "/:name",
  websocket.socketHandler((socket, ctx) => {
    // Send data
    socket.send(`Hello ${ctx.params.name}!`);

    // Receive data
    socket.on("message", data => {
      if (data === "Goodbye!") {
        // Close socket
        socket.close();
        return;
      }

      socket.send("You said: " + data);
    });
  })
);
```

The 3rd argument is the WebSocket server (`wss`).

### Note

This package uses the `ctx.data._socketHandler` key, do _not_ override it.
This can change at any time and should be considered internal.

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release),
include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/Cretezy/routex-websocket/issues).
