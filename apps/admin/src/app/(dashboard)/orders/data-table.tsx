"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { DataTablePagination } from "@/components/TablePagination";
import { getColumns } from "./columns";
import OrderDetailsSheet from "@/components/OrderDetailsSheet";
import { OrderType } from "@repo/types";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface DataTableProps {
  data: OrderType[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  const columns = getColumns((order) => setSelectedOrder(order));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => (row as any)._id,
    state: {
      sorting,
      rowSelection,
    },
  });
  console.log(rowSelection);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const ids = Object.keys(rowSelection); // ✅ these are now actual _ids
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids }),
        },
      );

      if (!res.ok) throw new Error("Failed to delete orders");

      toast.success("Orders deleted successfully");
      setRowSelection({});
      router.refresh(); // ✅ re-fetches server component data
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-md border">
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md m-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting
              ? "Deleting..."
              : `Delete (${Object.keys(rowSelection).length})`}
          </button>
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
      <OrderDetailsSheet
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
