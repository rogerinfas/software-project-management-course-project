export function paginationStart({ page, pageSize }: { page: number; pageSize: number }): number {
  return (page - 1) * pageSize;
}

export function calcTotalPages({ total, pageSize }: { total: number; pageSize: number }): number {
  return Math.ceil(total / pageSize);
}

export function hasNextPage({ page, totalPages }: { page: number; totalPages: number }): boolean {
  return page < totalPages;
}

export function hasPreviousPage({ page }: { page: number }): boolean {
  return page > 1;
}
