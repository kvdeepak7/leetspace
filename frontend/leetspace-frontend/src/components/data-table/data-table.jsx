import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { Filter, X } from "lucide-react"

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({ data, columns }) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { 
      sorting,
      columnFilters,
      columnVisibility 
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  // Handle difficulty filter
  React.useEffect(() => {
    if (difficultyFilter) {
      table.getColumn("difficulty")?.setFilterValue(difficultyFilter);
    } else {
      table.getColumn("difficulty")?.setFilterValue(undefined);
    }
  }, [difficultyFilter, table]);

  return (
    <div>
     <div className="flex items-center justify-between gap-4 py-4 flex-wrap border-b border-gray-200 dark:border-zinc-700">
      {/* Search input */}
      <Input
        placeholder="Search Problems"
        value={table.getColumn("title")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="max-w-sm flex-1 bg-white dark:bg-zinc-900 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-zinc-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center gap-2">
        {/* Difficulty filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm cursor-pointer text-gray-800 dark:text-white bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-md"
            >
              <Filter className="mr-2 h-4 w-4" />
              {difficultyFilter || "Difficulty"}
              {difficultyFilter && (
                <X 
                  className="ml-2 h-4 w-4 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDifficultyFilter("");
                  }}
                />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-zinc-900 text-sm border border-gray-200 dark:border-zinc-700 shadow-md rounded-md"
          >
            <DropdownMenuItem
              className="px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setDifficultyFilter("")}
            >
              All Difficulties
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setDifficultyFilter("Easy")}
            >
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                Easy
              </span>
              Easy
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setDifficultyFilter("Medium")}
            >
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mr-2">
                Medium
              </span>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setDifficultyFilter("Hard")}
            >
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 mr-2">
                Hard
              </span>
              Hard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Column toggle dropdown */}
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-sm cursor-pointer text-gray-800 dark:text-white bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-md"
        >
          Columns
        </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-white dark:bg-zinc-900 text-sm border border-gray-200 dark:border-zinc-700 shadow-md rounded-md"
        >
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize pl-8 pr-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-100 dark:bg-zinc-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 px-4 py-2"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => navigate(`/problems/${row.original.id}`)}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500 dark:text-gray-400"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      className="text-sm px-4 py-2 border border-gray-300 dark:border-zinc-600 text-gray-800 dark:text-white bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
      className="text-sm px-4 py-2 border border-gray-300 dark:border-zinc-600 text-gray-800 dark:text-white bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </Button>
  </div>
    </div>
  );
}
