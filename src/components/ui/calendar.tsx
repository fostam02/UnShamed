import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth, ...props }) => {
          const { goToMonth, nextMonth, previousMonth } = useNavigation();
          
          const year = displayMonth.getFullYear();
          const month = displayMonth.getMonth();
          
          const monthOptions = Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date();
            monthDate.setMonth(i);
            return {
              value: i.toString(),
              label: monthDate.toLocaleString('default', { month: 'long' })
            };
          });
          
          const currentYear = new Date().getFullYear();
          const yearOptions = Array.from({ length: 60 }, (_, i) => {
            const yearValue = currentYear - 60 + i + 1;
            return {
              value: yearValue.toString(),
              label: yearValue.toString()
            };
          });
          
          const handleMonthChange = (value: string) => {
            const newMonth = new Date(displayMonth);
            newMonth.setMonth(parseInt(value));
            goToMonth(newMonth);
          };
          
          const handleYearChange = (value: string) => {
            const newDate = new Date(displayMonth);
            newDate.setFullYear(parseInt(value));
            goToMonth(newDate);
          };
          
          return (
            <div {...props} className="flex justify-center items-center space-x-2 px-8">
              <button
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Select value={month.toString()} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-[120px] h-7 text-sm">
                    <SelectValue>
                      {displayMonth.toLocaleString('default', { month: 'long' })}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={year.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[80px] h-7 text-sm">
                    <SelectValue>{year}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <button
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }}
      {...props}
    />
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
