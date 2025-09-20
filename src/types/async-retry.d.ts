declare module "async-retry" {
  interface Options {
    retries?: number;
    factor?: number;
    minTimeout?: number;
    maxTimeout?: number;
    randomize?: boolean;
    onRetry?: (error: Error, attempt: number) => void;
  }

  type RetryFunction<T> = (bail: (e: Error) => void, attempt: number) => Promise<T>;

  function retry<T>(fn: RetryFunction<T>, options?: Options): Promise<T>;

  export = retry;
}
