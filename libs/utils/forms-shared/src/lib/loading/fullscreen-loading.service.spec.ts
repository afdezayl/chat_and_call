import { TestBed } from '@angular/core/testing';

import { FullscreenLoadingService } from './fullscreen-loading.service';

describe('FullscreenLoadingService', () => {
  let service: FullscreenLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullscreenLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
