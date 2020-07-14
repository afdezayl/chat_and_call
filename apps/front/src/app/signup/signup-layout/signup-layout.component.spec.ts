import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLayoutComponent } from './signup-layout.component';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

describe('SignupLayoutComponent', () => {
  let component: SignupLayoutComponent;
  let fixture: ComponentFixture<SignupLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialDesignModule, ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [ SignupLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
