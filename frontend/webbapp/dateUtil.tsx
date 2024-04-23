import { format } from "date-fns";

export function formatDate(dateString: Date) {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd HH:mm");
}
