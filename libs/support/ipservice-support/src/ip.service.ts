export interface IPService {
  fetch(ip: string): Promise<any>;
}
