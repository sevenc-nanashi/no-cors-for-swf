import { cp, mkdir, rm, writeFile } from "fs/promises"
import { build } from "esbuild"
import packageJson from "./package.json"
import AdmZip from "adm-zip"

const baseManifest = {
  name: "No CORS for swf",
  version: packageJson.version,
  description: packageJson.description,
  homepage_url: packageJson.homepage,
}

const esbuildOptions = (production: boolean) => ({
  bundle: true,
  minify: production,
  sourcemap: !production,
  target: ["es2020"],
})

const buildFirefox = async ({
  production = false,
}: {
  production?: boolean
}) => {
  await rm(`dist/firefox`, { recursive: true, force: true })
  await mkdir("dist/firefox", { recursive: true })

  await writeFile(
    `dist/firefox/manifest.json`,
    JSON.stringify({
      ...baseManifest,
      manifest_version: 2,
      permissions: ["webRequest", "webRequestBlocking", "*://*/*.swf"],
      background: {
        scripts: ["background.js"],
      },

      browser_specific_settings: {
        gecko: {
          id: "no-cors-for-swf@sevenc7c.com",
        },
      },
    })
  )
  await build({
    entryPoints: ["src/firefox.mts"],
    outfile: `dist/firefox/background.js`,
    ...esbuildOptions(production),
  })
  console.log("Build complete: dist/firefox")
}

const buildChrome = async ({
  production = false,
}: {
  production?: boolean
}) => {
  await rm(`dist/chrome`, { recursive: true, force: true })
  await mkdir("dist/chrome", { recursive: true })

  await writeFile(
    `dist/chrome/manifest.json`,
    JSON.stringify({
      ...baseManifest,
      manifest_version: 3,
      permissions: production
        ? ["declarativeNetRequest"]
        : ["declarativeNetRequest", "declarativeNetRequestFeedback"],
      host_permissions: ["*://*/*.swf"],

      declarative_net_request: {
        rule_resources: [
          {
            id: "no-cors-for-swf",
            enabled: true,
            path: "chromeRuleSet.json",
          },
        ],
      },
    })
  )

  await cp("src/chromeRuleSet.json", `dist/chrome/chromeRuleSet.json`)
  console.log("Build complete: dist/chrome")
}

const pack = async (browser: "chrome" | "firefox") => {
  await mkdir("dist/pack", { recursive: true })
  const archive = new AdmZip()
  archive.addLocalFolder(`dist/${browser}`)
  await archive.writeZipPromise(`dist/pack/no-cors-for-swf-${browser}.zip`)
  console.log(`Pack complete: dist/pack/no-cors-for-swf-${browser}.zip`)
}
;(async () => {
  console.log(`Building... (Version: ${packageJson.version})`)
  const packing = process.argv.includes("--pack")
  await buildFirefox({ production: packing })
  await buildChrome({ production: packing })
  if (packing) {
    console.log("Packing...")
    await pack("firefox")
    await pack("chrome")
  }
})()
