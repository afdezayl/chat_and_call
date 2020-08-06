module.exports = {
  name: 'socketcluster-shared',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/socketcluster/shared',
<<<<<<< HEAD
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
};
