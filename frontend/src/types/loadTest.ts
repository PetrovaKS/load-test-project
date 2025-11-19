export interface LoadTestConfig {
  requestsCount: number;
  delayMs: number;
  usePagination: boolean;
  pageSize?: number;
  useCache: boolean;
}

export interface LoadTestStats {
  sent: number;
  success: number;
  errors: number;
  duration: number;
}

export interface TestResult {
  config: LoadTestConfig;
  stats: LoadTestStats;
  isInterrupted?: boolean; // флаг прерывания
}
