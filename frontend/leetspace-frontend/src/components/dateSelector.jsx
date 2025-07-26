import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format,parse } from "date-fns";

export default function DateSolvedInput({ dateSolved, setDateSolved }) {
  const parsedDate = dateSolved ? new Date(dateSolved) : new Date();

  return (
    <div className="cursor-pointer grid gap-2">
      {/* <Label className="text-lg mb-1 block">Date Solved</Label> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer w-full justify-start text-left font-normal"
          >
            {dateSolved ? format(parsedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="cursor-pointer z-50 w-auto p-0 bg-white text-popover-foreground dark:bg-zinc-900 dark:text-white border border-border rounded-md shadow-md" align="start">
        <Calendar
            mode="single"
            selected={dateSolved ? parse(dateSolved, "yyyy-MM-dd", new Date()) : undefined}
            onSelect={(date) => {
              if (date) {
                const corrected = new Date(date);
                corrected.setDate(corrected.getDate() + 1); // ✅ add 1 day
                const formatted = corrected.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
                setDateSolved(formatted);
              }
            }}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
