"use client";

import { CheckCircle2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";
import { ErrorDialog } from "@/components/ui/error-dialog";

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
      <ErrorDialog
        message={getApiErrorMessage(error, errorMessage)}
      />
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
