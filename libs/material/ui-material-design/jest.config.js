module.exports = {
  name: 'material-ui-material-design',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/material/ui-material-design',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
