import { TestBed } from '@angular/core/testing';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { LanguagePickerDialogService } from './language-picker-dialog.service';

describe('LanguagePickerDialogService', () => {
  let service: LanguagePickerDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialDesignModule],
    });
    service = TestBed.inject(LanguagePickerDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
