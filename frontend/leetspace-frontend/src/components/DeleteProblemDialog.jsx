import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

export function DeleteProblemDialog({ problem, open, onOpenChange, onConfirm }) {
  const handleDelete = () => {
    if (problem) {
      onConfirm(problem.id);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Problem
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <span className="font-semibold">"{problem?.title}"</span>? 
            This action cannot be undone and will permanently remove the problem from your collection.
          </DialogDescription>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Problem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}