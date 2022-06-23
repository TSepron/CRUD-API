import path from 'path'
import ResolveTypescriptPlugin from 'resolve-typescript-plugin'

export default {
  mode: 'production',
  target: ['es6', 'node'],
  entry: path.resolve(process.cwd(), 'src/index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [new ResolveTypescriptPlugin()]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true,
  },
}
