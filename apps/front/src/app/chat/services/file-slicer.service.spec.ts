import { TestBed } from '@angular/core/testing';

import { FileSlicerService } from './file-slicer.service';

describe('FileSlicerService', () => {
  let service: FileSlicerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSlicerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
