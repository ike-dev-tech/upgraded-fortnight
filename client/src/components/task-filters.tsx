import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  currentFilter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 dark:text-white">フィルター</h2>
      <Card className="overflow-hidden">
        <CardContent className="p-2 flex space-x-1">
          <FilterButton 
            label="すべて" 
            active={currentFilter === "all"} 
            onClick={() => onFilterChange("all")}
          />
          <FilterButton 
            label="未完了" 
            active={currentFilter === "active"} 
            onClick={() => onFilterChange("active")}
          />
          <FilterButton 
            label="完了済み" 
            active={currentFilter === "completed"} 
            onClick={() => onFilterChange("completed")}
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-3 rounded-md transition text-sm font-medium",
        active ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
    >
      {label}
    </Button>
  );
}
