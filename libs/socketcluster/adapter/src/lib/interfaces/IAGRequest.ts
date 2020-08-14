import { AGServerSocket } from 'socketcluster-server';

export interface IAGRequest {
  socket: AGServerSocket;
  procedure: string;
  sent: boolean;
  data: any;
  end: Function;
  error: Function;
}
