import { async, TestBed } from '@angular/core/testing';
import { SocketclusterClientModule } from './socketcluster-client.module';

describe('SocketclusterSocketClientWebModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SocketclusterClientModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SocketclusterClientModule).toBeDefined();
  });
});
