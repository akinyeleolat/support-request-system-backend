
export interface CustomError {
  error: boolean;
  statusCode: number;
  message: string;
}

export function generateError(statusCode: number, message: string): CustomError {
    return {
      error: true,
      statusCode: statusCode,
      message: message,
    };
  }