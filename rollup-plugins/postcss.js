import postcss from "rollup-plugin-postcss";

export const getPostCss = ({ outputPath, isProduction }) =>
  postcss({
    extract: outputPath,
    extensions: [".scss"],
    use: ["sass"],
    minimize: isProduction,
  });
