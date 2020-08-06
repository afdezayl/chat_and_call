module.exports = {
  name: 'auth-shared',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/auth/shared',
<<<<<<< HEAD:libs/auth/shared/jest.config.js
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11:libs/auth/shared-auth-interfaces/jest.config.js
};
