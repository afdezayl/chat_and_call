import { async, TestBed } from '@angular/core/testing';
import { FeatureAuthWebModule } from './auth-feature-auth-web.module';

describe('AuthFeatureAuthWebModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureAuthWebModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FeatureAuthWebModule).toBeDefined();
  });
});
