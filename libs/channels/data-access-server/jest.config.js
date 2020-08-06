module.exports = {
  name: 'channels-data-access-server',
  preset: '../../../jest.config.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
<<<<<<< HEAD
  coverageDirectory: '../../../coverage/libs/channels/data-access-server',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
=======
  coverageDirectory:
    '../../../coverage/libs/channels/data-access-server',
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
};
