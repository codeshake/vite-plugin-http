import { createRequire } from "node:module"
import typescript from "rollup-plugin-typescript2"

const packageJson = createRequire(import.meta.url)("./package.json")
const tsConfigJson = createRequire(import.meta.url)("./tsconfig.json")

const externalPackages = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
])

const externalPackagesExpression = new RegExp(`^(${[...externalPackages].join("|")})([:/].+)?$`)

const getOutput = (type, extension) => ({
    dir: tsConfigJson.compilerOptions.outDir,
    entryFileNames: `[name].${extension}`,
    exports: "named",
    format: type,
    sourcemap: true,
})

export default {
    cache: false,
    external: (moduleId, _parentId, isResolved) => !isResolved && externalPackagesExpression.test(moduleId),
    input: "src/index.ts",
    output: [getOutput("cjs", "cjs"), getOutput("esm", "mjs")],
    plugins: [
        typescript({
            exclude: ["node_modules"],
            useTsconfigDeclarationDir: true,
        }),
    ],
}
