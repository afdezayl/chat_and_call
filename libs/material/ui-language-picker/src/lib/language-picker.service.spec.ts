import { TestBed } from '@angular/core/testing';

import { LanguagePickerService } from './language-picker.service';

describe('LanguagePickerService', () => {
  let service: LanguagePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguagePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
