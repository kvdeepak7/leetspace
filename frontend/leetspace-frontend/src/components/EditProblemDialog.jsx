import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EditProblemDialog({ problem, open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "",
    tags: "",
    notes: "",
    url: "",
  });

  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title || "",
        difficulty: problem.difficulty || "",
        tags: Array.isArray(problem.tags) ? problem.tags.join(", ") : "",
        notes: problem.notes || "",
        url: problem.url || "",
      });
    }
  }, [problem]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    onSave(problem.id, updatedData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form data to original values
    if (problem) {
      setFormData({
        title: problem.title || "",
        difficulty: problem.difficulty || "",
        tags: Array.isArray(problem.tags) ? problem.tags.join(", ") : "",
        notes: problem.notes || "",
        url: problem.url || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Problem</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="col-span-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
              placeholder="Problem title"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right font-medium">
              Difficulty
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
            >
              <SelectTrigger className="col-span-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600">
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right font-medium">
              URL
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className="col-span-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className="col-span-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
              placeholder="Array, Hash Table, Two Pointers"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right font-medium pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="col-span-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 min-h-[100px]"
              placeholder="Add your notes about this problem..."
            />
          </div>
        </div>

        <DialogFooter>
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
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}