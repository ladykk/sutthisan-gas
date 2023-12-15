"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getDateFormat, getTimeFormat } from "@/lib/dayjs";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  className?: string;
  classNames?: {
    Table?: string;
    TableHeader?: string;
    TableRow?: string;
    TableHead?: string;
    TableBody?: string;
    TableCell?: string;
  };
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  classNames,
  loading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("rounded-md border bg-white", className)}>
      <Table className={classNames?.Table}>
        <TableHeader className={classNames?.TableHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={classNames?.TableRow}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={classNames?.TableHead}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={classNames?.TableBody}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={classNames?.TableRow}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={classNames?.TableCell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={classNames?.TableRow}>
              <TableCell
                colSpan={columns.length}
                className={cn("h-24 text-center", classNames?.TableCell)}
              >
                {loading ? "Loading..." : "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

type DataTableCellTextProps = {
  value: Date | string | null;
  display: "date" | "time" | "datetime";
};
export function DataTableDate(props: DataTableCellTextProps) {
  const date = props.value ? new Date(props.value) : null;
  const display = props.display ?? "datetime";
  const showDate = display === "date" || display === "datetime";
  const showTime = display === "time" || display === "datetime";

  if (!date) return "-";

  return (
    <div>
      {showDate && <p>{getDateFormat(date)}</p>}
      {showTime && <p>{getTimeFormat(date)}</p>}
    </div>
  );
}

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  count: number | undefined;
  currentPage: number | undefined;
  itemsPerPage: number | undefined;
  totalPages: number | undefined;
  onItemsPerPageChange?: (value: number) => void;
  onPageChange: (value: number) => void;
  className?: string;
}

export function DataTablePagination({
  count,
  currentPage = 1,
  itemsPerPage = 10,
  totalPages = 1,
  onItemsPerPageChange,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="flex-1 text-sm text-muted-foreground">
        Total {count} results
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => {
              onItemsPerPageChange?.(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${itemsPerPage}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
