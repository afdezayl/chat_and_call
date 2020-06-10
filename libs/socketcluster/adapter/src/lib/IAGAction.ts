import { IncomingMessage } from 'http';
import { AGServerSocket } from 'socketcluster-server';

export interface IAGAction {
  /**
   * A string constant which is used to indicate that an action is a low level WebSocket handshake action.
   */
  HANDSHAKE_WS: string;
  /**
   * A string constant which is used to indicate that an action is an SocketCluster handshake action.
   */
  HANDSHAKE_AG: string;
  /**
   * A string constant which is used to indicate that an action is a message action.
   */
  MESSAGE: string;
  /**
   * A string constant which is used to indicate that an action is a transmit action.
   */
  TRANSMIT: string;
  /**
   * A string constant which is used to indicate that an action is an invoke action.
   */
  INVOKE: string;
  /**
   * A string constant which is used to indicate that an action is a subscribe action.
   */
  SUBSCRIBE: string;
  /**
   * A string constant which is used to indicate that an action is an inbound publish action.
   */
  PUBLISH_IN: string;
  /**
   * A string constant which is used to indicate that an action is an outbout publish action.
   */
  PUBLISH_OUT: string;
  /**
   * A string constant which is used to indicate that an action is an authenticate action.
   */
  AUTHENTICATE: string;
    /**
   * This field exists on all action types except for the HANDSHAKE_WS action. It holds the AGServerSocket whose corresponding client initiated the action.
   */
  socket: AGServerSocket;
  /**
   * This field exists on all AGAction instances. It represents the type of the action as a string. It can be used by a middleware function to decide whether to allow or block an action.
   */
  type: string;
  /**
   * This field only exists on actions of type HANDSHAKE_WS and HANDSHAKE_SC. It holds a Node.js http.IncomingMessage object.
   */
  request?: IncomingMessage;
  /**
   * This field exists on all action types except for HANDSHAKE_WS, HANDSHAKE_SC and AUTHENTICATE actions. It holds the payload associated with the action.
   */
  data?: any;
  /**
   * This field exists only on the TRANSMIT action. It represents the name of the receiver which this action would trigger if it is allowed through by the middleware.
   */
  receiver?: string;
  /**
   * This field exists only on the INVOKE action. It represents the name of the procedure which this action will invoke if it is allowed through by the middleware.
   */
  procedure?: string;
  /**
   * This field exists only on the SUBSCRIBE, PUBLISH_IN and PUBLISH_OUT actions. It represents the name of the channel which this action would affect if it is allowed through by the middleware.
   */
  channel?: string;
  /**
   * This field exists only on the AUTHENTICATE action. It represents the signed auth token which was used by the client for authentication. This value can be null.
   */
  signedAuthToken?: any | null;
  /**
   * This field exists only on the AUTHENTICATE action. It represents the raw auth token data which was used by the client for authentication. This value can be null.
   */
  authToken?: any | null;
  /**
   * The outcome of the action. Can be null, 'allowed' or 'blocked' depending on which method was called on the action.
   */
  outcome: null | 'allowed' | 'blocked';
  /**
   * A Promise which will resolve or reject depending on whether the action was allowed or blocked. This property is mostly meant for internal use by SocketCluster middleware.
   */
  promise: Promise<any>;
  /**
   * Allow an action to be processed by the back end server/socket logic.
   * @param packet  This method accepts an optional packet argument; if provided, the packet will be used as the action payload instead of action.data. This allows middleware to transform data from clients before it is handled by the back end logic.
   */
  allow(packet?: any): Function;
  /**
   * Prevent an action from reaching the back end server/socket logic.
   * @param error This method accepts an Error as argument. This error will be sent to the client which initiated the action.
   */
  block(error: Error): Function;

}
