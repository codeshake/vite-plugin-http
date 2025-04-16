import { PluginOption, ViteDevServer } from "vite"

const handleHttpServer = (viteDevServer: ViteDevServer, pathToHttpServer: string) => {
    viteDevServer.middlewares.use(async (request, response, next) => {
        try {
            const { default: http } = await viteDevServer.ssrLoadModule(pathToHttpServer, {
                fixStacktrace: true,
            })

            http(request, response, next)
        } catch (error) {
            if (error instanceof Error) {
                viteDevServer.ssrFixStacktrace(error)
            } else {
                console.error("Vite HTTP plugin error:", error)
            }

            next(error)
        }
    })
}

const viteHttp = (pathToHttpServer: string, order: "pre" | "post" = "pre"): PluginOption => {
    return {
        name: "vite-plugin-http",
        enforce: "pre",

        config: (config, env) => {
            return {
                ...config,
                define: {
                    ...config.define,
                    "import.meta.env.SSR_BUILD": JSON.stringify(env.isSsrBuild ?? false),
                },
            }
        },
        configureServer: viteDevServer => {
            if (order === "pre") {
                handleHttpServer(viteDevServer, pathToHttpServer)
            } else if (order === "post") {
                return () => {
                    handleHttpServer(viteDevServer, pathToHttpServer)
                }
            }

            return undefined
        },
    }
}

export default viteHttp
