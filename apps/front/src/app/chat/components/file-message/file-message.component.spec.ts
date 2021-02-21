import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMessageComponent } from './file-message.component';

describe('FileMessageComponent', () => {
  let component: FileMessageComponent;
  let fixture: ComponentFixture<FileMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
