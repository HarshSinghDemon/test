// Faculty Guard Mock Data & Intelligence Service
// Simulates pulling activity records from Layer 4 and evaluating access risk in Layer 3.

/**
 * Simulates retrieving recent file activity logs from Layer 4 database storage.
 * Each record includes timestamp, user_id, action, and file_name per specification.
 */
export function fetch_audit_logs() {
  // Returns raw activity events without technical jargon
  return [
    {
      log_id: 'log_301',
      timestamp: '2026-09-08T03:14:22Z',
      user_id: 'usr_9921_smith',
      action: 'Multiple Files Downloaded',
      file_name: 'Calculus_Final_Exam_2026.pdf (400 files total)',
      location: 'Kyiv, Ukraine',
      status: 'Blocked - Account Locked',
    },
    {
      log_id: 'log_302',
      timestamp: '2026-09-07T14:20:00Z',
      user_id: 'usr_9921_smith',
      action: 'File Viewed',
      file_name: 'Homework_3_Grading_Rubric.docx',
      location: 'Boston, MA',
      status: 'Normal Access',
    },
    {
      log_id: 'log_303',
      timestamp: '2026-09-07T09:15:10Z',
      user_id: 'usr_9921_smith',
      action: 'File Uploaded',
      file_name: 'Midterm_Study_Guide.pdf',
      location: 'Boston, MA',
      status: 'Normal Access',
    },
  ];
}

/**
 * Evaluates file access events and checks for unusual activity or locations.
 * Returns risk score, risk level, plain-English alert reasons, and action taken.
 */
export function evaluate_risk(event_data) {
  // Uses the 3:00 AM high-volume download event as default data
  const currentEvent = event_data || {
    user_id: 'usr_9921_smith',
    action: 'Multiple Files Downloaded',
    file_name: 'Calculus_Final_Exam_2026.pdf',
  };

  const alertReasons = [
    'Unknown Location: Download request came from Kyiv, Ukraine instead of your usual location in Boston.',
    'Unusual Time: Files were requested at 3:14 AM outside normal hours.',
    'Unusual Download Spike: 400 exam files were requested in under four minutes.',
  ];

  return {
    risk_score: 88,
    risk_level: 'HIGH',
    summary: 'Alert: 400 exam files were requested at 3 AM from an unknown location. Account temporarily locked.',
    alert_reasons: alertReasons,
    action_taken: 'Account temporarily locked. A 6-digit verification code was sent to your phone to confirm your identity.',
    status: 'account_locked',
    evaluated_at: new Date().toISOString(),
    event_details: {
      user_id: currentEvent.user_id,
      file_name: currentEvent.file_name,
      time: '3:14 AM EST',
    },
  };
}

// Aliases for compatibility
export const evaluateRisk = evaluate_risk;
export const fetchAuditLogs = fetch_audit_logs;
