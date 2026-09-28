-- Verified A2P 10DLC Compliance Opt-In Ledger
-- Matches exact 7-column schema of `ignitus-d1e7b.analytics.bleed_posture_matrix`
INSERT INTO `ignitus-d1e7b.analytics.bleed_posture_matrix`
(client_name, contact_phone, trade_sector, inquiry, source, v_bleed_recovered, timestamp_utc)
VALUES
('Explicit Opt-In Registrant', '+13185550199', 'SMS Opt-In Compliance', 'Explicit Web Checkbox Consent Registered on https://ignituscore.com/optin/ (Disclosure: v2026.09.26-A2P-DIRECT-CONSENT-v1)', 'web_optin_form', 0, CURRENT_TIMESTAMP());
