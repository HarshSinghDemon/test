// Layer 3 Machine Learning Anomaly Detection Service & Layer 4 Audit Log Interface
// Implements fetch_audit_logs() and evaluate_risk()

/**
 * Layer 4: Simulated database query returning recent institutional file access logs.
 * Includes timestamp, user_id, action, and file_name per specification.
 */
export async function fetch_audit_logs() {
  return [
    {
      log_id: 'log_9401',
      timestamp: '2026-09-08 03:14:22',
      user_id: 'prof_smith_cs',
      action: 'Batch Download',
      file_name: 'CS401_Final_Exam_Solutions.pdf',
      ip_address: '172.56.21.9',
      location: 'Bucharest, RO (VPN Detected)',
    },
    {
      log_id: 'log_9402',
      timestamp: '2026-09-08 03:13:58',
      user_id: 'prof_smith_cs',
      action: 'Batch Download',
      file_name: 'Fall2026_Midterm_Gradebook.xlsx',
      ip_address: '172.56.21.9',
      location: 'Bucharest, RO (VPN Detected)',
    },
    {
      log_id: 'log_9403',
      timestamp: '2026-09-08 03:13:12',
      user_id: 'prof_smith_cs',
      action: 'Batch Download',
      file_name: 'CS401_Lab_Source_Code.zip',
      ip_address: '172.56.21.9',
      location: 'Bucharest, RO (VPN Detected)',
    },
    {
      log_id: 'log_9399',
      timestamp: '2026-09-07 16:45:10',
      user_id: 'prof_chen_math',
      action: 'Single View',
      file_name: 'Math101_Syllabus.docx',
      ip_address: '192.168.1.104',
      location: 'Campus Network (San Francisco, CA)',
    },
    {
      log_id: 'log_9398',
      timestamp: '2026-09-07 14:12:04',
      user_id: 'prof_smith_cs',
      action: 'File Upload',
      file_name: 'CS401_Lecture_03_Slides.key',
      ip_address: '192.168.1.55',
      location: 'Campus Network (San Francisco, CA)',
    },
  ];
}

/**
 * Layer 3: Anomaly evaluation function simulating Isolation Forest and Burst Detector.
 * Evaluates download volume, time of access, and geographic deviation.
 */
export function evaluate_risk(event_data = {}) {
  const count = event_data.files_in_window ?? 412;
  const minutes = event_data.window_minutes ?? 4;
  const isNightTime = true; // 03:14 AM
  const isVpnLocation = (event_data.location || '').toLowerCase().includes('vpn') || true;

  // Calibrate risk score based on burst factor and time deviation
  let computedScore = 20;
  const reasons = [];

  if (count > 50) {
    computedScore += 45;
    reasons.push(
      `Unusual download volume: ${count} course files downloaded in ${minutes} minutes (Normal baseline: 3 files/hour).`
    );
  }

  if (isNightTime) {
    computedScore += 15;
    reasons.push('Off-hours access: High-volume activity recorded at 03:14 AM outside typical teaching hours.');
  }

  if (isVpnLocation) {
    computedScore += 14;
    reasons.push('Unrecognized connection: Request originated from a non-campus IP address via commercial VPN node.');
  }

  const finalScore = Math.min(100, computedScore);
  const isHighRisk = finalScore >= 80;

  return {
    risk_score: finalScore,
    risk_level: isHighRisk ? 'HIGH' : finalScore >= 50 ? 'MEDIUM' : 'LOW',
    status: isHighRisk ? 'account_locked' : 'suspicious',
    summary: isHighRisk
      ? 'Critical burst download detected from an unrecognized network.'
      : 'Moderate anomaly detected during course file sync.',
    alert_reasons: reasons,
    action_taken: isHighRisk
      ? 'Course file repository automatically locked. Requires Multi-Factor Authentication (MFA) to restore access.'
      : 'Access logged and flagged for periodic educator review.',
    evaluated_at: new Date().toISOString(),
    requires_mfa_unlock: isHighRisk,
  };
}
