import { IncomingMessage } from 'http';
import { AGServerSocket } from 'socketcluster-server';

const actionTypes = {
  HANDSHAKE_WS: 'handshakeWS',
  HANDSHAKE_SC: 'handshakeSC',
  MESSAGE: 'message',
  TRANSMIT: 'transmit',
  INVOKE: 'invoke',
  SUBSCRIBE: 'subscribe',
  PUBLISH_IN: 'publishIn',
  PUBLISH_OUT: 'publishOut',
  AUTHENTICATE: 'authenticate',
} as const;

abstract class ActionTypeConstants {
  /**
   * A string constant which is used to indicate that an action is a low level WebSocket handshake action.
   */
  readonly HANDSHAKE_WS = actionTypes.HANDSHAKE_WS;
  /**
   * A string constant which is used to indicate that an action is an SocketCluster handshake action.
   */
  readonly HANDSHAKE_SC = actionTypes.HANDSHAKE_SC;
  /**
   * A string constant which is used to indicate that an action is a message action.
   */
  readonly MESSAGE = actionTypes.MESSAGE;
  /**
   * A string constant which is used to indicate that an action is a transmit action.
   */
  readonly TRANSMIT = actionTypes.TRANSMIT;
  /**
   * A string constant which is used to indicate that an action is an invoke action.
   */
  readonly INVOKE = actionTypes.INVOKE;
  /**
   * A string constant which is used to indicate that an action is a subscribe action.
   */
  readonly SUBSCRIBE = actionTypes.SUBSCRIBE;
  /**
   * A string constant which is used to indicate that an action is an inbound publish action.
   */
  readonly PUBLISH_IN = actionTypes.PUBLISH_IN;
  /**
   * A string constant which is used to indicate that an action is an outbound publish action.
   */
  readonly PUBLISH_OUT = actionTypes.PUBLISH_OUT;
  /**
   * A string constant which is used to indicate that an action is an authenticate action.
   */
  readonly AUTHENTICATE = actionTypes.AUTHENTICATE;
}

export type HandshakeWSAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.HANDSHAKE_WS;
    request: IncomingMessage;
  };

export type HandshakeSCAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.HANDSHAKE_SC;
    socket: AGServerSocket;
    request: IncomingMessage;
  };

export type MessageAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.MESSAGE;
    socket: AGServerSocket;
    data: any;
  };

export type TransmitAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.TRANSMIT;
    socket: AGServerSocket;
    data: any;
    receiver: string;
  };

export type InvokeAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.INVOKE;
    socket: AGServerSocket;
    data: any;
    procedure: string;
  };

export type SubscribeAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.SUBSCRIBE;
    socket: AGServerSocket;
    data: any;
    channel: string;
  };

export type PublishInAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.PUBLISH_IN;
    socket: AGServerSocket;
    data: any;
    channel: string;
  };

export type PublishOutAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.PUBLISH_OUT;
    socket: AGServerSocket;
    data: any;
    channel: string;
  };

export type AuthenticateAction = ActionTypeConstants &
  BaseAction & {
    type: typeof actionTypes.AUTHENTICATE;
    socket: AGServerSocket;
    signedAuthToken: string | null;
    authToken: any | null;
  };

export type AGAction =
  | HandshakeWSAction
  | HandshakeSCAction
  | MessageAction
  | TransmitAction
  | InvokeAction
  | SubscribeAction
  | PublishInAction
  | PublishOutAction
  | AuthenticateAction;

interface BaseAction {
  /**
   * This field exists on all AGAction instances. It represents the type of the action as a string. It can be used by a middleware function to decide whether to allow or block an action.
   */
  type: string;
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
