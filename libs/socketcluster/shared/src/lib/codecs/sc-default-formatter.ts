import { AGServer } from 'socketcluster-server';
export class SCDefaultFormatter implements AGServer.CodecEngine {
  readonly base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  readonly validJSONStartRegex = /^[ \n\r\t]*[{\[]/;
  readonly isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  readonly isNode =
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;
  // Encode a raw JavaScript object (which is in the SC protocol format) into a format for
  // transfering it over the wire. In this case, we just convert it into a simple JSON string.
  // If you want to create your own custom codec, you can encode the object into any format
  // (e.g. binary ArrayBuffer or string with any kind of compression) so long as your decode
  // function is able to rehydrate that object back into its original JavaScript Object format
  // (which adheres to the SC protocol).
  // See https://github.com/SocketCluster/socketcluster/blob/master/socketcluster-protocol.md
  // for details about the SC protocol.
  encode(object: unknown) {
    // Leave ping or pong message as is
    if (object === '#1' || object === '#2') {
      return object;
    }
    return JSON.stringify(object, this.binaryToBase64Replacer);
  }

  // Decode the data which was transmitted over the wire to a JavaScript Object in a format which SC understands.
  // See encode function for more details.
  decode(input: any) {
    if (input == null) {
      return null;
    }
    // Leave ping or pong message as is
    if (input === '#1' || input === '#2') {
      return input;
    }
    var message = input.toString();

    // Performance optimization to detect invalid JSON packet sooner.
    if (!this.validJSONStartRegex.test(message)) {
      return message;
    }

    try {
      return JSON.parse(message);
    } catch (err) {}
    return message;
  }

  private arrayBufferToBase64(arraybuffer: ArrayBuffer) {
    var bytes = new Uint8Array(arraybuffer);
    var len = bytes.length;
    var base64 = '';

    for (var i = 0; i < len; i += 3) {
      base64 += this.base64Chars[bytes[i] >> 2];
      base64 += this.base64Chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += this.base64Chars[
        ((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)
      ];
      base64 += this.base64Chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '==';
    }

    return base64;
  }

  binaryToBase64Replacer = (key: string, value: any) => {
    if (this.isBrowser && value instanceof ArrayBuffer) {
      return {
        base64: true,
        data: this.arrayBufferToBase64(value),
      };
    } else if (this.isNode) {
      if (value instanceof global.Buffer) {
        return {
          base64: true,
          data: value.toString('base64'),
        };
      }
      // Some versions of Node.js convert Buffers to Objects before they are passed to
      // the replacer function - Because of this, we need to rehydrate Buffers
      // before we can convert them to base64 strings.
      if (value?.type === 'Buffer' && Array.isArray(value.data)) {
        var rehydratedBuffer;
        if (global.Buffer.from) {
          rehydratedBuffer = global.Buffer.from(value.data);
        } else {
          rehydratedBuffer = new global.Buffer(value.data);
        }
        return {
          base64: true,
          data: rehydratedBuffer.toString('base64'),
        };
      }
    }
    return value;
  };
}
