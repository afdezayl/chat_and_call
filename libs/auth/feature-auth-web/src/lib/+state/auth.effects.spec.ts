import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';

import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { HttpClientModule } from '@angular/common/http';
import { hot } from 'jasmine-marbles';

describe('AuthEffects', () => {
  let actions: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), HttpClientModule],
      providers: [
        AuthEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it('should be created', async () => {
    expect(effects).toBeTruthy();
  });

  describe('loadAuth$', () => {
    /* it('should work', () => {
      actions = hot('-a-|', {
        a: AuthActions.sendLoginRequest({
          password: 'admin',
          username: 'admin',
        }),
      });

      const expected = hot('-a-|', {
        a: AuthActions.loginSuccess(),
      });

      expect(effects.loadAuth$).toBeObservable(expected);
    }); */
  });
});
