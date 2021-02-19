export interface SCCodecEventHandler {
  event:
    | '#handshake'
    | '#publish'
    | '#kickOut'
    | '#setAuthToken'
    | '#removeAuthToken'
    | '#authenticate'
    | '#subscribe'
    | '#unsubscribe';
  encode: (object: any) => Uint8Array;
  decode: (input: Uint8Array) => any | null;
}
