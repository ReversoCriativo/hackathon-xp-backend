import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception?.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code = [
      exception?.getStatus(),
      status,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ].find((c) => c);

    const responseMessage =
      (exception.getResponse() as any)?.message || exception.message;

    response.status(status).json({
      error: {
        code,
        message: responseMessage,
        path: request.url,
      },
    });
  }
}
