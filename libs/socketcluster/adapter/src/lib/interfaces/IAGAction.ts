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

type ActionType = typeof actionTypes[keyof typeof actionTypes];

abstract class BaseConstantsActions {
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

export type HandshakeWSAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.HANDSHAKE_WS;
    request: IncomingMessage;
  };

export type HandshakeSCAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.HANDSHAKE_SC;
    socket: AGServerSocket;
    request: IncomingMessage;
  };

export type MessageAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.MESSAGE;
    socket: AGServerSocket;
    data: any;
  };

export type TransmitAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.TRANSMIT;
    socket: AGServerSocket;
    data: any;
    receiver: string;
  };

export type InvokeAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.INVOKE;
    socket: AGServerSocket;
    data: any;
    procedure: string;
  };

export type SubscribeAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.SUBSCRIBE;
    socket: AGServerSocket;
    data: any;
    channel: string;
  };

export type PublishInAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.PUBLISH_IN;
    socket: AGServerSocket;
    data: any;
    channel: string;
  };

export type PublishOutAction = BaseConstantsActions &
  BaseAction & {
    type: typeof actionTypes.PUBLISH_OUT;
    socket: AGServerSocket;
    data: any;
    channel: string;
  };

export type AuthenticateAction = BaseConstantsActions &
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

export abstract class IAGAction extends BaseConstantsActions {
  /**
   * This field exists on all action types except for the HANDSHAKE_WS action. It holds the AGServerSocket whose corresponding client initiated the action.
   */
  socket: AGServerSocket;
  /**
   * This field exists on all AGAction instances. It represents the type of the action as a string. It can be used by a middleware function to decide whether to allow or block an action.
   */
  type: ActionType;
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
  signedAuthToken?: string | null;
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
  abstract allow(packet?: any): Function;
  /**
   * Prevent an action from reaching the back end server/socket logic.
   * @param error This method accepts an Error as argument. This error will be sent to the client which initiated the action.
   */
  abstract block(error: Error): Function;
}

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
