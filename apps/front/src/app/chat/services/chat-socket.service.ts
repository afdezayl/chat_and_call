import { Injectable } from '@angular/core';
import { SocketService } from '@chat-and-call/socketcluster/socket-client-web';
import {
  Observable,
  BehaviorSubject,
  Subject,
  from,
  interval,
  ReplaySubject,
} from 'rxjs';
import { Channel, Message, BasicMessage } from '@chat-and-call/channels/shared';
import {
  tap,
  delay,
  expand,
  filter,
  map,
  exhaust,
  take,
  finalize,
  takeUntil,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  constructor(private socket: SocketService) {}

  // Creates backpressure...
  private createSubjectFromIterator<T>(asyncIterable: any): ReplaySubject<T> {
    const subject$ = new ReplaySubject<T>();
    const iterator = asyncIterable[Symbol.asyncIterator]();

    const push = async () => {
      const { done, value } = await iterator.next();

      if (done && value === undefined) {
        subject$.complete();
      } else {
        subject$.next(value);
        push();
      }
    };

    push();
    return subject$;
  }
  /* Maybe a backpressure test?
const fromAsyncIterable = iterable =>
  from(iterable.next()).pipe(
    expand(() => iterable.next()),
    filter(x => !x.done),
    map(x => x.value)
  );
----------------------------------------------------
  const { BehaviorSubject } = require('rxjs')

  function createIteratorSubject(iterator) {
    const subject$ = new BehaviorSubject();

    subject$.push = function(value) {
      const {done, value} = iterator.next(value);.

      if (done && value === undefined) {
          subject$.complete();
      } else {
          subject$.next(value);
      }
    }

    subject$.push()

    return subject$
  }
*/
  getChannels(): Observable<Array<Channel>> {
    return this.socket.get<Array<Channel>>('channels/', null);
  }

  subscribeToChannel(id: number | string) {
    const subject$ = new ReplaySubject<Message>();

    (async() => {
      for await(const data of this.socket.subscribeToChannel(id)) {
        subject$.next(data);
      }
    })();

    return subject$;
  }

  publishMessage(message: BasicMessage) {
    return this.socket.publishToChannel(message, message.channel);
  }
}
