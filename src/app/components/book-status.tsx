import { Badge } from "@/components/ui/badge";

export default function BookStatus({ status }: { status: string }) {
  function getColor() {
    switch (status) {
      case "unread":
        return "bg-red-500";
      case "reading":
        return "bg-yellow-500";
      case "read":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <Badge variant="outline" className={`rounded-full ${getColor()}`}>
      {status}
    </Badge>
  );
}
