DELETE FROM `ignitus-d1e7b.analytics.bleed_posture_matrix`
WHERE source = 'ghost_form_abandonment_gated' OR STARTS_WITH(source, 'ghost_form');
