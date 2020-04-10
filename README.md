# Routex WebSocket [![npm](https://img.shields.io/npm/v/@routex/websocket.svg)](https://www.npmjs.com/package/@routex/websocket) [![Travis CI](https://img.shields.io/travis/com/routexjs/routex-websocket.svg)](https://travis-ci.com/routexjs/routex-websocket) [![Codecov](https://img.shields.io/codecov/c/github/routexjs/routex-websocket.svg)](https://codecov.io/gh/routexjs/routex-websocket)

WebSockets for [Routex](https://www.npmjs.com/package/routex).

[Documentation](https://routex.js.org/docs/packages/websocket) - [GitHub](https://github.com/routexjs/routex-websocket)

## Example

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
  websocket.socketHandler((socket) => {
    // Echo server
    socket.on("message", (data) => {
      socket.send("You said: " + data);
    });
  })
);

app.listen(port).then(() => console.log(`Listening on ${port}`));
```

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release),
include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/routexjs/routex-websocket/issues).
