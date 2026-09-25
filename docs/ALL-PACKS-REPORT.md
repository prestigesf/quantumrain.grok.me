# All-pack engine report

Generated 2026-09-25T19:46:30.622Z

Engine: DeadlineSF `engine.mjs`  ·  packs bundle `2bd41a911eae198a5406fbec79039b81577e97030ceca6c5c3619f33fa8ae350`  ·  14 packs

Facts: Prestige ships software, uses crypto, claims PQC + supply-chain transparency, contract wants SBOM. Federal high-value flags are off. No control evidence attached.

## Counts

- APPLIES: 4 (ab2013, cisa-sbom-2026, cyclonedx-cbom-1.6, cyclonedx-cbom-sbom)
- DOES_NOT_APPLY: 1 (eo_14412)
- INDETERMINATE: 9 (co_sb24_205, deployment_controls, eu_ai_act, eu_ai_act_art50, il_hb3773, nyc_ll144, sb942, tx_hb149, ut_sb149)
- Outcomes: {"HUMAN_REVIEW":13,"ALLOW":1}
- Strength head: 100 / 100

## Strength ledger (earlier engine receipts)

| Pack | Before | After | Δ | Result |
|---|---:|---:|---:|---|
| PQC-FIPS204 | 41.5 | 44.5 | 3 | IMPROVED |
| SUITE-TC01-36 | 44.5 | 87.5 | 43 | IMPROVED |
| FRONTIER-TC37-46 | 87.5 | 92.5 | 5 | IMPROVED |
| PROVENANCE-GAPS | 92.5 | 92.5 | 0 | VALIDATED_NO_CHANGE |
| EVIDENCE-REPLAY | 92.5 | 100 | 7.5 | IMPROVED |

## Each pack

### AB 2013 (`ab2013`)

California Generative AI Training Data Transparency Act  ·  US-CA  ·  v1.0.0  ·  5 requirements / 15 controls

- Applicability: **APPLIES**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: INSUFFICIENT_EVIDENCE

| Requirement | In scope | Status | Why |
|---|---|---|---|
| req-training-data-documentation | true | UNKNOWN | no evidence submitted for: ctl-documentation-published, ctl-documentation-per-system |
| req-dataset-sources | true | UNKNOWN | no evidence submitted for: ctl-dataset-sources-owners, ctl-dataset-licensing, ctl-collection-period, ctl-first-use-dates |
| req-dataset-composition | true | UNKNOWN | no evidence submitted for: ctl-datapoint-count, ctl-ip-protected-content, ctl-personal-information, ctl-aggregate-consumer-information |
| req-dataset-processing | true | UNKNOWN | no evidence submitted for: ctl-purpose-description, ctl-cleaning-and-processing, ctl-synthetic-data |
| req-update-on-substantial-modification | true | UNKNOWN | no evidence submitted for: ctl-modification-trigger, ctl-documentation-versioning |

Reasons:
- REQUIREMENT_STATUS_UNKNOWN: req-training-data-documentation: no evidence submitted for: ctl-documentation-published, ctl-documentation-per-system
- REQUIREMENT_STATUS_UNKNOWN: req-dataset-sources: no evidence submitted for: ctl-dataset-sources-owners, ctl-dataset-licensing, ctl-collection-period, ctl-first-use-dates
- REQUIREMENT_STATUS_UNKNOWN: req-dataset-composition: no evidence submitted for: ctl-datapoint-count, ctl-ip-protected-content, ctl-personal-information, ctl-aggregate-consumer-information
- REQUIREMENT_STATUS_UNKNOWN: req-dataset-processing: no evidence submitted for: ctl-purpose-description, ctl-cleaning-and-processing, ctl-synthetic-data
- REQUIREMENT_STATUS_UNKNOWN: req-update-on-substantial-modification: no evidence submitted for: ctl-modification-trigger, ctl-documentation-versioning

### SBOM 2026 (`cisa-sbom-2026`)

Software Bill of Materials (CISA 2026 Minimum Elements)  ·  US-FED-GUIDANCE  ·  v1.0.0  ·  5 requirements / 11 controls

- Applicability: **APPLIES**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: INSUFFICIENT_EVIDENCE

| Requirement | In scope | Status | Why |
|---|---|---|---|
| req-sbom-exists | true | UNKNOWN | no evidence submitted for: ctl-sbom-document, ctl-sbom-per-release |
| req-sbom-minimum-fields | true | UNKNOWN | no evidence submitted for: ctl-producer-name-version, ctl-identifiers-and-hash, ctl-license-and-deps, ctl-author-tool-context |
| req-sbom-automation | true | UNKNOWN | no evidence submitted for: ctl-sbom-tool-named, ctl-sbom-in-release-pipeline |
| req-sbom-share | true | UNKNOWN | no evidence submitted for: ctl-sbom-delivery-path, ctl-sbom-no-secret-leak |
| req-sbom-refresh | true | UNKNOWN | no evidence submitted for: ctl-sbom-matches-build |

Reasons:
- REQUIREMENT_STATUS_UNKNOWN: req-sbom-exists: no evidence submitted for: ctl-sbom-document, ctl-sbom-per-release
- REQUIREMENT_STATUS_UNKNOWN: req-sbom-minimum-fields: no evidence submitted for: ctl-producer-name-version, ctl-identifiers-and-hash, ctl-license-and-deps, ctl-author-tool-context
- REQUIREMENT_STATUS_UNKNOWN: req-sbom-automation: no evidence submitted for: ctl-sbom-tool-named, ctl-sbom-in-release-pipeline
- REQUIREMENT_STATUS_UNKNOWN: req-sbom-share: no evidence submitted for: ctl-sbom-delivery-path, ctl-sbom-no-secret-leak
- REQUIREMENT_STATUS_UNKNOWN: req-sbom-refresh: no evidence submitted for: ctl-sbom-matches-build

### Colorado AI Act (`co_sb24_205`)

Colorado Artificial Intelligence Act  ·  US-CO  ·  v1.0.0  ·  7 requirements / 15 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: does_business_in_co, high_risk_ai_system, role

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: does_business_in_co, high_risk_ai_system, role

### QBOM / CBOM 1.6 (`cyclonedx-cbom-1.6`)

Cryptographic Bill of Materials (CycloneDX 1.6 CBOM)  ·  INDUSTRY-STANDARD  ·  v1.0.0  ·  5 requirements / 10 controls

- Applicability: **APPLIES**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: INSUFFICIENT_EVIDENCE

| Requirement | In scope | Status | Why |
|---|---|---|---|
| req-cbom-exists | true | UNKNOWN | no evidence submitted for: ctl-cbom-document, ctl-cbom-per-system |
| req-cbom-asset-types | true | UNKNOWN | no evidence submitted for: ctl-algorithms-listed, ctl-protocols-listed, ctl-certs-and-material |
| req-cbom-quantum-levels | true | UNKNOWN | no evidence submitted for: ctl-nist-qsl-present, ctl-no-false-pqc |
| req-cbom-dependencies | true | UNKNOWN | no evidence submitted for: ctl-uses-or-provides |
| req-cbom-refresh | true | UNKNOWN | no evidence submitted for: ctl-cbom-timestamp, ctl-cbom-trigger |

Reasons:
- REQUIREMENT_STATUS_UNKNOWN: req-cbom-exists: no evidence submitted for: ctl-cbom-document, ctl-cbom-per-system
- REQUIREMENT_STATUS_UNKNOWN: req-cbom-asset-types: no evidence submitted for: ctl-algorithms-listed, ctl-protocols-listed, ctl-certs-and-material
- REQUIREMENT_STATUS_UNKNOWN: req-cbom-quantum-levels: no evidence submitted for: ctl-nist-qsl-present, ctl-no-false-pqc
- REQUIREMENT_STATUS_UNKNOWN: req-cbom-dependencies: no evidence submitted for: ctl-uses-or-provides
- REQUIREMENT_STATUS_UNKNOWN: req-cbom-refresh: no evidence submitted for: ctl-cbom-timestamp, ctl-cbom-trigger

### SBOM+QBOM (`cyclonedx-cbom-sbom`)

Software and Cryptographic Bills of Materials (SBOM + CBOM)  ·  INDUSTRY-STANDARD  ·  v1.0.0  ·  6 requirements / 12 controls

- Applicability: **APPLIES**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: INSUFFICIENT_EVIDENCE

| Requirement | In scope | Status | Why |
|---|---|---|---|
| req-both-boms-exist | true | UNKNOWN | no evidence submitted for: ctl-sbom-present, ctl-cbom-present, ctl-same-release-scope |
| req-sbom-minimum-fields | true | UNKNOWN | no evidence submitted for: ctl-sbom-fields, ctl-sbom-automated |
| req-cbom-assets-and-levels | true | UNKNOWN | no evidence submitted for: ctl-cbom-asset-types, ctl-nist-qsl, ctl-no-false-pqc |
| req-crosswalk | true | UNKNOWN | no evidence submitted for: ctl-crypto-to-component |
| req-no-secret-material | true | UNKNOWN | no evidence submitted for: ctl-no-key-material |
| req-joint-refresh | true | UNKNOWN | no evidence submitted for: ctl-paired-timestamp, ctl-named-owner |

Reasons:
- REQUIREMENT_STATUS_UNKNOWN: req-both-boms-exist: no evidence submitted for: ctl-sbom-present, ctl-cbom-present, ctl-same-release-scope
- REQUIREMENT_STATUS_UNKNOWN: req-sbom-minimum-fields: no evidence submitted for: ctl-sbom-fields, ctl-sbom-automated
- REQUIREMENT_STATUS_UNKNOWN: req-cbom-assets-and-levels: no evidence submitted for: ctl-cbom-asset-types, ctl-nist-qsl, ctl-no-false-pqc
- REQUIREMENT_STATUS_UNKNOWN: req-crosswalk: no evidence submitted for: ctl-crypto-to-component
- REQUIREMENT_STATUS_UNKNOWN: req-no-secret-material: no evidence submitted for: ctl-no-key-material
- REQUIREMENT_STATUS_UNKNOWN: req-joint-refresh: no evidence submitted for: ctl-paired-timestamp, ctl-named-owner

### Deployment Controls (`deployment_controls`)

Operational Deployment, Compute Threshold, and Sovereign Compute Controls  ·  MULTI  ·  v1.0.0  ·  4 requirements / 9 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: high_impact_autonomous_deployment, training_flops_above_1e26, cross_border_personal_data_transfer, government_or_defense_workload

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: cross_border_personal_data_transfer, government_or_defense_workload, high_impact_autonomous_deployment, training_flops_above_1e26

### EO 14412 (`eo_14412`)

Securing the Nation Against Advanced Cryptographic Attacks  ·  US_FEDERAL  ·  v2026.06  ·  2 requirements / 2 controls

- Applicability: **DOES_NOT_APPLY**
- Outcome: **ALLOW**
- Confidence: HIGH  ·  Escalation: NONE

Reasons:
- LAW_NOT_APPLICABLE: Applicability conditions are not met for these facts.

### EU AI Act (`eu_ai_act`)

EU Artificial Intelligence Act  ·  EU  ·  v1.0.0  ·  10 requirements / 24 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: places_ai_on_eu_market, risk_tier

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: places_ai_on_eu_market, risk_tier

### EU AI Act Art. 50 (`eu_ai_act_art50`)

EU AI Act Article 50 Transparency Obligations  ·  EU  ·  v1.0.0  ·  3 requirements / 6 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: direct_user_interaction, synthetic_media_generation, public_interest_publication, places_ai_on_eu_market

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: direct_user_interaction, places_ai_on_eu_market, public_interest_publication, synthetic_media_generation

### Illinois HB 3773 (`il_hb3773`)

Illinois Human Rights Act - Artificial Intelligence in Employment  ·  US-IL  ·  v1.0.0  ·  4 requirements / 8 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: employer_in_il, uses_ai_in_employment_decisions

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: employer_in_il, uses_ai_in_employment_decisions

### NYC Local Law 144 (`nyc_ll144`)

New York City Automated Employment Decision Tools Law  ·  US-NY-NYC  ·  v1.0.0  ·  4 requirements / 9 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: uses_aedt, nyc_employment_decisions

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: nyc_employment_decisions, uses_aedt

### SB 942 (`sb942`)

California AI Transparency Act  ·  US-CA  ·  v1.0.0  ·  4 requirements / 9 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: monthly_visitors

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: monthly_visitors

### Texas TRAIGA (`tx_hb149`)

Texas Responsible Artificial Intelligence Governance Act  ·  US-TX  ·  v1.0.0  ·  5 requirements / 9 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: develops_or_deploys_ai, operates_in_tx, markets_to_tx_residents

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: develops_or_deploys_ai, markets_to_tx_residents, operates_in_tx

### Utah AI Policy Act (`ut_sb149`)

Utah Artificial Intelligence Policy Act  ·  US-UT  ·  v1.0.0  ·  3 requirements / 6 controls

- Applicability: **INDETERMINATE**
- Outcome: **HUMAN_REVIEW**
- Confidence: LOW  ·  Escalation: APPLICABILITY_UNRESOLVED
- Missing facts: uses_generative_ai_with_consumers, operates_in_ut

Reasons:
- APPLICABILITY_UNRESOLVED: Cannot establish whether this law reaches the organization.
- MISSING_FACTS: missing facts: operates_in_ut, uses_generative_ai_with_consumers

