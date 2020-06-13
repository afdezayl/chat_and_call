import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class SocketClusterExceptionFilter
  implements ExceptionFilter<WsException> {
  catch(exception: WsException, host: ArgumentsHost) {
    const wsContext = host.switchToWs();
    const socket = wsContext.getClient();
    const request = wsContext.getData();

    const error = exception.getError();

    const response = this.isObject(error) ? JSON.stringify(error) : error;

    request.error(response);
  }

  // Including arrays
  isObject(obj: any) {
    return obj === Object(obj);
  }
}
