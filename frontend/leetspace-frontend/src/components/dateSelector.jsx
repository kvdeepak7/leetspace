import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format,parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function DateSolvedInput({ dateSolved, setDateSolved }) {
    // Helper function to parse YYYY-MM-DD string safely in local timezone
    const parseLocalDate = (dateString) => {
      if (!dateString) return new Date();
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed
    };
  
    // Helper function to format date as YYYY-MM-DD without timezone issues
    const formatDateToYYYYMMDD = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const parsedDate = dateSolved ? parseLocalDate(dateSolved) : new Date();

  return (
    <div className="cursor-pointer grid gap-2">
      {/* <Label className="text-lg mb-1 block">Date Solved</Label> */}
      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost" // ghost removes borders and background
          className="w-full justify-start text-left font-normal hover:bg-muted/50 focus:ring-2 focus:ring-primary"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {dateSolved ? format(parsedDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="z-50 w-auto p-0 bg-white dark:bg-zinc-900 text-popover-foreground dark:text-white shadow-md rounded-md"
        align="start"
      >
        <Calendar
            mode="single"
            selected={dateSolved ? parseLocalDate(dateSolved) : undefined}
            onSelect={(date) => {
              if (date) {
                const formatted = formatDateToYYYYMMDD(date);
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
