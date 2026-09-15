import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import "./PublicFeedback.css";

type PublicFeedbackType = "loading" | "error" | "empty" | "success";

interface PublicFeedbackProps {
  type: PublicFeedbackType;
  title: string;
  message?: string;
  children?: ReactNode;
}

const feedbackIcons = {
  loading: Loader2,
  error: AlertCircle,
  empty: Inbox,
  success: Inbox,
};

function PublicFeedback({
  type,
  title,
  message,
  children,
}: PublicFeedbackProps) {
  const Icon = feedbackIcons[type];

  return (
    <div className={`public-feedback public-feedback-${type}`} role="status">
      <div className="public-feedback-icon">
        <Icon size={28} />
      </div>

      <div className="public-feedback-content">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {children && <div className="public-feedback-actions">{children}</div>}
      </div>
    </div>
  );
}

export default PublicFeedback;
