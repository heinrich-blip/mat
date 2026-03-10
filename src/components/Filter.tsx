import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { FilterIcon, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string | number;
  color?: string;
}

interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multi-select" | "date-range" | "text";
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: string | string[];
}

interface FilterProps {
  config: FilterConfig;
  value: any;
  onValueChange: (value: any) => void;
  onRemove?: () => void;
  className?: string;
}

const Filter: React.FC<FilterProps> = ({ config, value, onValueChange, onRemove, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderFilterContent = () => {
    switch (config.type) {
      case "select":
        return (
          <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent className="w-[300px]">
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "multi-select":
        return (
          <Select multiple value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent className="w-[300px]">
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "date-range":
        return (
          <div className="flex gap-2">
            <DatePicker
              value={value?.start}
              onValueChange={(date) => onValueChange({ ...value, start: date ? date.toISOString().split('T')[0] : null })}
              placeholder="Start date"
            />
            <DatePicker
              value={value?.end}
              onValueChange={(date) => onValueChange({ ...value, end: date ? date.toISOString().split('T')[0] : null })}
              placeholder="End date"
            />
          </div>
        );
      
      case "text":
        return (
          <Input
            value={value}
            onValueChange={onValueChange}
            placeholder={config.placeholder}
            className="w-full"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">{config.label}:</span>
      <div className="flex-1 min-w-0">{renderFilterContent()}</div>
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="p-1"
        >
          <XMarkIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Filter;