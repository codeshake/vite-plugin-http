# vite-plugin-http

Vite plugin allowing to use http server as middleware for vite development server.

## Installation

```sh
# npm
npm install --save-dev vite-plugin-http

# yarn
yarn add -D vite-plugin-http

# pnpm
pnpm add -D vite-plugin-http
```

Add types to tsconfig:

```json
{
    "compilerOptions": {
        "types": ["vite-plugin-http/types"]
    }
}
```

## Usage

Make nodejs server:

```js
# src/server.js
import http from "node:http"

const serverRequestListener = (request: http.IncomingMessage, response: http.ServerResponse, next?: (err?: any) => void) => {
    if (request.url === "/demo" && request.method === "GET") {
        response.writeHead(200, {
            "Content-Type": "application/json",
        }).end(`{"message": "Demo"}`)
    } else {
        next?.()
    }
}

# Package also provides SSR_BUILD variable (--ssr flag)
# It will be ignored in development mode
if (import.meta.env.SSR_BUILD) {
    const server = http.createServer(serverRequestListener)

    server.listen(3000)
}

export default serverRequestListener
```

Or express:

```js
# src/server.js
import express from "express"

const app = express()

app.get("/demo", (request, response) => {
    response.status(200).json(`{"message": "Demo"}`)
})

if (import.meta.env.SSR_BUILD) {
    app.listen(3000)
}

export default app
```

```js
import http from "vite-plugin-http"

export default {
    plugins: [
        http("./src/server.js"),
    ],
}
```

Try to `fetch("/demo")` in your browser.

### Options

```js
http(
    pathToServer,

    // default is pre
    // pre - http server will run before internal middlewares
    // post - after all middlewares. Usually requires for `appType: "custom"` mode with a custom html.
    // More details here: https://vite.dev/guide/api-plugin.html#configureserver
    order,
)
```
