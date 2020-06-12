module.exports = {
  name: 'socketcluster-socket-client-web',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/socketcluster/socket-client-web',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
