import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import "./AdminFeedback.css";

type AdminFeedbackType = "loading" | "error" | "empty";

interface AdminFeedbackProps {
  type: AdminFeedbackType;
  title: string;
  message?: string;
  children?: ReactNode;
}

const feedbackIcons = {
  loading: Loader2,
  error: AlertTriangle,
  empty: Inbox,
};

function AdminFeedback({
  type,
  title,
  message,
  children,
}: AdminFeedbackProps) {
  const Icon = feedbackIcons[type];

  return (
    <div className={`admin-feedback admin-feedback-${type}`} role="status">
      <div className="admin-feedback-icon">
        <Icon size={28} />
      </div>

      <div className="admin-feedback-content">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {children && <div className="admin-feedback-actions">{children}</div>}
      </div>
    </div>
  );
}

export default AdminFeedback;
