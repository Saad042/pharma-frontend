import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlertCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: "warning" | "destructive";
  onClick?: () => void;
}

export function AlertCard({ title, count, icon: Icon, variant, onClick }: AlertCardProps) {
  const borderColor = variant === "warning" ? "border-l-chart-3" : "border-l-chart-4";
  const iconColor = variant === "warning" ? "text-chart-3" : "text-chart-4";

  return (
    <Card
      className={`border-l-4 ${borderColor} ${onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tabular-nums">{count}</span>
          <Badge variant={variant === "warning" ? "secondary" : "destructive"}>
            Alert
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
