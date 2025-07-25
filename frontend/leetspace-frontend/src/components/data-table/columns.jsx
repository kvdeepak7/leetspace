import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const colorMap = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800',
};

export const columns = (onEdit, onDelete) => [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorMap[row.original.difficulty]}`}>
      {row.original.difficulty}
    </span>
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => <div>{row.original.tags.join(", ")}</div>,
    },
    {
      accessorKey: "Action",
      header: "",
      id: "actions",
      cell: ({ row }) => {
        const problem = row.original

        const handleEdit = (e) => {
          e.stopPropagation(); // Prevent row click navigation
          if (onEdit) {
            onEdit(problem);
          }
        };

        const handleDelete = (e) => {
          e.stopPropagation(); // Prevent row click navigation
          if (onDelete) {
            onDelete(problem);
          }
        };
   
        return (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              onClick={(e) => e.stopPropagation()} // Prevent row click when opening menu
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-md text-sm text-gray-800 dark:text-gray-200"
          >
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem 
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 border-gray-200 dark:border-zinc-700" />
            <DropdownMenuItem 
              className="px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer text-red-600 dark:text-red-400 flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )
      },
    },
  ];