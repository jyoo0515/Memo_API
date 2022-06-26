export interface PaginationOptions {
  take: number;
  page: number;
}

export class Pagination<T> {
  public data: T[];
  public pageSize: number;
  public totalCount: number;
  public totalPage: number;

  constructor(data: T[], total: number) {
    this.pageSize = data.length;
    this.totalCount = total;
    this.totalPage = Math.ceil(this.totalCount / this.pageSize) || 0;
    this.data = data;
  }
}
