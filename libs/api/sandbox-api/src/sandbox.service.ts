export interface ISandboxService {
  run<T>(code: string, options?: Record<string, any>): Promise<T | null>;
}
