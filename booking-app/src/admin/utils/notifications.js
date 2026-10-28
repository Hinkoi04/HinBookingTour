import { toast } from "sonner";

export const toastDeleted = (message) =>
  toast(message, {
    style: {
      backgroundColor: "#dc2626",
      borderColor: "#dc2626",
      color: "#fff",
    },
  });
