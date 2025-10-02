import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import getTerser from "./rollup-plugins/terser.js";
import replace from "@rollup/plugin-replace";

const isProduction = process.env.NODE_ENV === "production";
const outputDir = isProduction ? "build-output" : "watch-output";
const terser = getTerser();

export default [
  {
    input: "src/code/content/index.ts",
    output: {
      dir: outputDir,
      format: "cjs",
      entryFileNames: "code/content/[name].js",
    },
    watch: {
      clearScreen: false,
    },
    plugins: [
      /* copies all files from src to output, but only once on `npm run watch` */
      copy({
        targets: [{ src: ["src/**/*", "!**/*/code"], dest: outputDir }],
        flatten: false,
      }),
      typescript(),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
      isProduction && terser,
    ],
  },
  {
    input: "src/code/popup/index.ts",
    output: {
      dir: outputDir,
      format: "cjs",
      entryFileNames: "code/popup/[name].js",
    },
    plugins: [typescript(), isProduction && terser],
  },
  {
    input: "src/code/background/index.ts",
    output: {
      dir: outputDir,
      format: "cjs",
      entryFileNames: "code/background/[name].js",
    },
    plugins: [typescript(), isProduction && terser],
  },
];
