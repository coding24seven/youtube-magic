import sass from 'rollup-plugin-sass';

export default function getSass({
  output,
  isProduction,
}: {
  output: string;
  isProduction: boolean;
}) {
  return sass({
    api: 'modern',
    output,
    options: {
      style: isProduction ? 'compressed' : 'expanded',
    },
  });
}
