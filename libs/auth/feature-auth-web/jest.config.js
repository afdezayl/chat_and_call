module.exports = {
  name: 'auth-feature-auth-web',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/auth/feature-auth-web',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
