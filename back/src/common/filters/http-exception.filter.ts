import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    return throwError(() => ({
      message: exception.message,
      status: exception.getStatus(),
    }));
  }
}
