import terser from '@rollup/plugin-terser';

export default function getTerser() {
  return terser({
    compress: {
      defaults: true,
      drop_console: true,
      drop_debugger: true,
    },
    mangle: true,
    format: {
      comments: false,
    },
  });
}
