import { status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";



export type RpcExceptionHandlerOptions<T> = {
    notFoundValue?: T;
    customExceptionHandler?: (error: RpcException) => T | null;
  };

export async function handleRpcException<T>(
    promise: Promise<T>,
    options: RpcExceptionHandlerOptions<T> = {},
  ): Promise<T | null> {
    const { notFoundValue = null, customExceptionHandler } = options;
  
    try {
      return await promise;
    } catch (error) {
      if (error instanceof RpcException) {
        const rpcError = error.getError() as { code: number; message: string };
  
        if (customExceptionHandler) {
          return customExceptionHandler(error);
        }
  
        switch (rpcError.code) {
          case status.NOT_FOUND:
            return notFoundValue;
          default:
            throw error;
        }
      }
      throw error;
    }
  }