import terser from "@rollup/plugin-terser";

export default function getTerser() {
  return terser({
    compress: {
      defaults: true, // Enable all default compressions
      drop_console: true,
      drop_debugger: true,
    },
    mangle: true,
    format: {
      comments: false,
    },
  });
}
