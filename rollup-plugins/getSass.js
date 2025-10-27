import sass from 'rollup-plugin-sass';

export const getSass = ({ output, isProduction }) =>
  sass({
    api: 'modern',
    output,
    options: {
      style: isProduction ? 'compressed' : 'expanded',
      sourceMap: !isProduction,
    },
  });
