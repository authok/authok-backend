

export enum PeriodDto {
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  all = 'all',
}

export class MetricDto {
  key: string;     // 指标名称
  value: number;    // 指标值
  period: PeriodDto;  // 粒度
  time: string;       // 时间
}