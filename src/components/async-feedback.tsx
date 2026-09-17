import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";

type AsyncFeedbackProps = {
  error: unknown;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
  successMessage: string;
};

export function AsyncFeedback({
  error,
  isError,
  isSuccess,
  errorMessage,
  successMessage,
}: AsyncFeedbackProps) {
  if (isError) {
    return (
      <p className="feedback-message feedback-message-error" role="alert">
        <AlertCircle aria-hidden="true" size={16} />
        {getApiErrorMessage(error, errorMessage)}
      </p>
    );
  }

  if (isSuccess) {
    return (
      <p className="feedback-message feedback-message-success" role="status">
        <CheckCircle2 aria-hidden="true" size={16} />
        {successMessage}
      </p>
    );
  }

  return null;
}
