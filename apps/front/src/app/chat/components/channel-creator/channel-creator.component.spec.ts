import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCreatorComponent } from './channel-creator.component';

describe('ChannelCreatorComponent', () => {
  let component: ChannelCreatorComponent;
  let fixture: ComponentFixture<ChannelCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
