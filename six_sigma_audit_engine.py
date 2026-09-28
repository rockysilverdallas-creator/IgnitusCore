"""Ignitus Core - Six Sigma SDK Process Audit Engine (Generation 05)

Evaluates operational variances across 4 defect opportunities:
  1. Process Latency (>450ms UCL)
  2. Error Rate (>1.5%)
  3. Regulatory Compliance
  4. Lead Capture Gap (Ghost forms, 3s call drops, session abandonment)
Maps detected defects across the 8 Core Service Lines with Cobra Protocol
criticality indexing.
"""

from datetime import datetime, timezone
import json
from typing import Any, Dict, List
import uuid

COBRA_SIGMA_MATRIX = {
    "1.0_CORE_SUPPLY_CHAIN": {
        "ctq_target": "Inventory Velocity & Lead-Time Stability",
        "defect_type": "SUPPLY_CHAIN_STAGNATION",
        "severity_weight": 0.95,
        "anatomy_of_failure": (
            "Lead-time variance expands past control limits; failure triggers"
            " localized stockouts or severe material overages."
        ),
    },
    "2.0_COMMUNICATION_CHANNELS": {
        "ctq_target": "Pipeline Response Latency & Lead Retention",
        "defect_type": "PROCESS_VARIANCE_LEAK",
        "severity_weight": 0.85,
        "anatomy_of_failure": (
            "Inbound communication pipelines fail silently; absolute drop in"
            " live user engagement and connection metrics."
        ),
    },
    "3.0_CAPACITY_SCHEDULING": {
        "ctq_target": "Machine / Labor Overhead Synchronization",
        "defect_type": "RESOURCE_OVER_ALLOCATION",
        "severity_weight": 0.80,
        "anatomy_of_failure": (
            "Production schedules decouple from actual worker capacity,"
            " creating massive bottleneck queues on the floor."
        ),
    },
    "4.0_QUALITY_CONTROL": {
        "ctq_target": "Defect Prevention & Ingress Precision",
        "defect_type": "PROCESS_VARIANCE_SPIKE",
        "severity_weight": 0.90,
        "anatomy_of_failure": (
            "Inspection loops skip granular variables; standard deviations"
            " expand beyond acceptable upper/lower control limits."
        ),
    },
    "5.0_REGULATORY_COMPLIANCE": {
        "ctq_target": "Operational Boundary Policy Adherence",
        "defect_type": "NON_CONFORMANCE_EXPOSURE",
        "severity_weight": 0.95,
        "anatomy_of_failure": (
            "Local facility layouts or shift patterns diverge from regional"
            " safety mandates, resulting in immediate stoppage flags."
        ),
    },
    "6.0_FACILITY_INGRESS": {
        "ctq_target": "Physical & Digital Ingress Intake Efficiency",
        "defect_type": "MATERIAL_FLOW_BLOCKAGE",
        "severity_weight": 0.75,
        "anatomy_of_failure": (
            "Loading dock dwell times increase; bottlenecking at the intake"
            " boundary stalls downstream operations."
        ),
    },
    "7.0_TELEMETRY_LOGISTICS": {
        "ctq_target": "Real-Time Sensor Sync & Log Accuracy",
        "defect_type": "TELEMETRY_BLACKOUT",
        "severity_weight": 0.70,
        "anatomy_of_failure": (
            "Real-time weight or location tracking drops; backend operations"
            " execute blindly without data feedback."
        ),
    },
    "8.0_COMPUTE_SCALING": {
        "ctq_target": "Horizontal Capacity & Resource Allocation",
        "defect_type": "COMPUTE_SILO_ISOLATION",
        "severity_weight": 0.65,
        "anatomy_of_failure": (
            "Edge device sensor arrays fill up local buffers without streaming"
            " out data, causing data queues to crash locally."
        ),
    },
}


def execute_sdk_process_audit(
    telemetry_batch: List[Dict[str, Any]],
) -> Dict[str, Any]:
  """Audits batch telemetry against Six Sigma CTQ thresholds and maps variances."""
  audit_ledger = []
  total_opportunities = 0
  total_defects_logged = 0
  sweep_id = f"SWEEP-{int(datetime.now(timezone.utc).timestamp())}"
  OPPORTUNITIES_PER_UNIT = 4

  for record in telemetry_batch:
    entity_name = record.get("facility_name", "Unknown Unit")
    detected_variances = []
    lead_capture_details = []

    # Check 1: Latency (>450ms UCL)
    if record.get("process_latency_ms", 0) > 450:
      detected_variances.append("LATENCY_EXCEEDS_UCL")

    # Check 2: Error Rate (>1.5%)
    if record.get("error_rate_pct", 0.0) > 1.5:
      detected_variances.append("ERROR_RATE_OUT_OF_BOUNDS")

    # Check 3: Regulatory Compliance
    if not record.get("is_compliant", True):
      detected_variances.append("REGULATORY_NON_CONFORMANCE")

    # Check 4: LEAD_CAPTURE_GAP (Ghost Forms, Short Hang-ups, Abandoned Sessions)
    has_ghost_form = record.get("ghost_form_detected", False)
    short_call_drop = record.get("short_call_drop_detected", False) or (
        record.get("call_duration_sec", 999) <= 10
        and record.get("call_status") in ["completed", "no-answer", "busy"]
    )
    session_abandoned = record.get("session_abandoned_pre_submit", False)

    if has_ghost_form:
      lead_capture_details.append("GHOST_FORM_ABANDONED")
    if short_call_drop:
      lead_capture_details.append("HANGUP_PRE_VOICEMAIL_DROP")
    if session_abandoned:
      lead_capture_details.append("SESSION_DROPPED_AT_CHECKOUT")

    if lead_capture_details:
      detected_variances.append("LEAD_CAPTURE_GAP")

    unit_defects = len(detected_variances)
    total_opportunities += OPPORTUNITIES_PER_UNIT
    total_defects_logged += unit_defects

    # Fan out to the 8-line matrix if variances are observed
    if unit_defects > 0:
      unit_dpu = round(unit_defects / float(OPPORTUNITIES_PER_UNIT), 4)

      for line_id, matrix_specs in COBRA_SIGMA_MATRIX.items():
        criticality_index = round(
            unit_dpu * matrix_specs["severity_weight"], 4
        )

        line_variances = list(detected_variances)
        if "LEAD_CAPTURE_GAP" in detected_variances and line_id in [
            "2.0_COMMUNICATION_CHANNELS",
            "6.0_FACILITY_INGRESS",
        ]:
          line_variances.extend(lead_capture_details)

        audit_ledger.append({
            "vulnerability_id": str(uuid.uuid4()),
            "sweep_id": sweep_id,
            "target_entity": entity_name,
            "service_line": line_id,
            "critical_to_quality_target": matrix_specs["ctq_target"],
            "defect_classification": matrix_specs["defect_type"],
            "observed_variances": line_variances,
            "defects_per_unit": unit_dpu,
            "criticality_index": criticality_index,
            "anatomy_of_failure": matrix_specs["anatomy_of_failure"],
            "pipeline_status": "STAGED_FOR_SDK_INGRESS",
        })

  yield_rate = (
      round(
          ((total_opportunities - total_defects_logged) / total_opportunities)
          * 100,
          2,
      )
      if total_opportunities > 0
      else 100.0
  )

  return {
      "sweep_metadata": {
          "sweep_id": sweep_id,
          "total_records_evaluated": len(telemetry_batch),
          "total_opportunities_audited": total_opportunities,
          "total_defects_found": total_defects_logged,
          "calculated_process_yield_pct": yield_rate,
      },
      "anchored_defects": audit_ledger,
  }


if __name__ == "__main__":
  test_batch = [
      {
          "facility_name": "Shreveport Regional Hub",
          "process_latency_ms": 520,
          "error_rate_pct": 2.1,
          "is_compliant": True,
          "ghost_form_detected": True,
      },
      {
          "facility_name": "Bossier Dispatch Unit",
          "process_latency_ms": 110,
          "error_rate_pct": 0.1,
          "is_compliant": True,
          "short_call_drop_detected": True,
      },
  ]
  output = execute_sdk_process_audit(test_batch)
  print(json.dumps(output["sweep_metadata"], indent=2))
  print(f"Generated {len(output['anchored_defects'])} anchored matrix rows.")
