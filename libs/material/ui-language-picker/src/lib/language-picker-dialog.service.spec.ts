import { TestBed } from '@angular/core/testing';

import { LanguagePickerDialogService } from './language-picker-dialog.service';

describe('LanguagePickerDialogService', () => {
  let service: LanguagePickerDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguagePickerDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
