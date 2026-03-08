// Each node is either a question node or a result node.
// Question node: { id, question, hint, options: [{ label, description, next }] }
// Result node:   { id, result: true, recommendation, rationale, partners, alternatives, caveats }

export const tree = {
  arr: {
    question: "What is the customer's estimated ARR?",
    hint: "Internal PS is best positioned for strategic accounts above $300k ARR.",
    options: [
      {
        label: "$300k+ ARR",
        description: "Strategic account — internal PS ownership",
        next: "internal_strategic",
      },
      {
        label: "Under $300k ARR",
        description: "Partner-led engagement",
        next: "capability",
      },
    ],
  },

  internal_strategic: {
    result: true,
    recommendation: "Internal PS",
    type: "internal",
    rationale:
      "At $300k+ ARR this is a strategic account. Internal Professional Services should own the engagement to protect the relationship, ensure consistent delivery quality, and maximise expansion opportunity.",
    partners: [],
    caveats: [
      "Partner co-delivery may be considered for overflow capacity — maintain internal PS as lead.",
      "If a specific niche capability is needed (e.g. CC migration), a specialist partner can be brought in as a sub-contractor under internal PS oversight.",
    ],
    alternatives: [],
  },

  capability: {
    question: "What is the primary capability required?",
    hint: "Select the main workstream. If multiple capabilities are needed, lead with the most complex.",
    options: [
      {
        label: "CS Implementation",
        description: "Gainsight CS platform configuration & rollout",
        next: "cs_impl_region",
      },
      {
        label: "CS Strategy & Advisory",
        description: "Operating model design, playbooks, CS architecture",
        next: "cs_strategy_type",
      },
      {
        label: "PX / Product Experience",
        description: "In-app engagements, PX Impl, journey orchestration",
        next: "px_region",
      },
      {
        label: "Community Cloud (CC)",
        description: "CC implementation or migration",
        next: "cc_type",
      },
      {
        label: "Surveys & Tracking (ST)",
        description: "Survey design, NPS programmes, tracking configuration",
        next: "st_region",
      },
      {
        label: "Program Management",
        description: "Programme governance, PMO, executive steering",
        next: "result_espeut",
      },
      {
        label: "NXT / Advanced Platform",
        description: "Gainsight NXT-specific expertise",
        next: "result_nxt_internal",
      },
    ],
  },

  // ── CS IMPLEMENTATION ──────────────────────────────────────────────────────

  cs_impl_region: {
    question: "What region is the customer based in?",
    hint: "Partner coverage and rates vary significantly by region.",
    options: [
      { label: "EMEA", description: "UK, Europe, Middle East, Africa", next: "cs_impl_emea_scale" },
      { label: "US / Americas", description: "United States, Canada, LatAm", next: "result_ncloud" },
      { label: "India / APAC", description: "India, Asia-Pacific", next: "result_internal_apac" },
    ],
  },

  cs_impl_emea_scale: {
    question: "How would you describe the engagement scale?",
    hint: "Wigmore handles complex enterprise programmes; Atomify suits lighter-touch TAM/CS work.",
    options: [
      {
        label: "Enterprise / Complex",
        description: "Multi-stakeholder, multi-workstream, long programme",
        next: "result_wigmore",
      },
      {
        label: "Standard / Mid-market",
        description: "Straightforward implementation, single team",
        next: "result_wigmore_or_atomify",
      },
    ],
  },

  // ── CS STRATEGY ────────────────────────────────────────────────────────────

  cs_strategy_type: {
    question: "Is this pure advisory or strategy-plus-delivery?",
    hint: "Some partners are architects only; others can move from strategy into hands-on delivery.",
    options: [
      {
        label: "Pure strategy / advisory",
        description: "Frameworks, operating models, blueprints — no hands-on config",
        next: "cs_strategy_pure_region",
      },
      {
        label: "Strategy leading into delivery",
        description: "Advisory that transitions to implementation",
        next: "cs_strategy_delivery_region",
      },
    ],
  },

  cs_strategy_pure_region: {
    question: "Where is the customer?",
    options: [
      { label: "US", description: "", next: "result_valuize_gm" },
      { label: "EMEA", description: "", next: "result_wigmore_strategy" },
      { label: "India / APAC", description: "", next: "result_internal_apac" },
    ],
  },

  cs_strategy_delivery_region: {
    question: "Where is the customer?",
    options: [
      { label: "US", description: "", next: "result_ncloud" },
      { label: "EMEA", description: "", next: "result_wigmore" },
      { label: "India / APAC", description: "", next: "result_internal_apac" },
    ],
  },

  // ── PX ─────────────────────────────────────────────────────────────────────

  px_region: {
    question: "Where is the customer?",
    options: [
      {
        label: "US",
        description: "nCloud has primary PX capability",
        next: "result_ncloud_px",
      },
      {
        label: "EMEA",
        description: "Limited partner coverage — Wigmore has secondary PX",
        next: "result_wigmore_px",
      },
      {
        label: "India / APAC",
        description: "",
        next: "result_internal_apac",
      },
    ],
  },

  // ── COMMUNITY CLOUD ────────────────────────────────────────────────────────

  cc_type: {
    question: "What type of Community Cloud work is needed?",
    options: [
      {
        label: "Full CC Implementation",
        description: "New CC deployment, configuration, integrations",
        next: "cc_impl_cost",
      },
      {
        label: "CC Migration",
        description: "Migrating from Lithium, Jive, Khoros or other platform",
        next: "cc_migration_region",
      },
    ],
  },

  cc_impl_cost: {
    question: "Is cost a primary constraint?",
    hint: "Grazitti (India-based) offers significantly lower rates. iTalent is US-based with stronger enterprise pedigree.",
    options: [
      {
        label: "Yes — optimise for cost",
        description: "Offshore delivery acceptable",
        next: "result_grazitti",
      },
      {
        label: "No — prioritise US delivery",
        description: "On-shore or near-shore preferred",
        next: "result_italent",
      },
    ],
  },

  cc_migration_region: {
    question: "Where is the customer?",
    options: [
      {
        label: "EMEA (especially Netherlands / Benelux)",
        description: "T2S Solutions specialise here",
        next: "result_t2s",
      },
      {
        label: "US",
        description: "iTalent has strong data migration capability",
        next: "result_italent_migration",
      },
      {
        label: "Cost-sensitive / global",
        description: "Grazitti can deliver globally at lower rates",
        next: "result_grazitti_migration",
      },
    ],
  },

  // ── SURVEYS & TRACKING ─────────────────────────────────────────────────────

  st_region: {
    question: "Where is the customer?",
    options: [
      {
        label: "US",
        description: "nCloud has primary ST capability",
        next: "result_ncloud_st",
      },
      {
        label: "EMEA",
        description: "Wigmore has ST in learning; Enterprise Minds secondary",
        next: "result_st_emea",
      },
      { label: "India / APAC", description: "", next: "result_internal_apac" },
    ],
  },

  // ── RESULTS ────────────────────────────────────────────────────────────────

  result_wigmore: {
    result: true,
    recommendation: "Wigmore IT",
    type: "partner",
    rationale:
      "Strongest EMEA partner with primary CS Implementation and CS Strategy capability. Suitable for complex, enterprise-scale programmes in the UK and broader EMEA.",
    partners: ["Wigmore IT"],
    alternatives: ["Atomify (lighter-touch EMEA engagements)"],
    caveats: ["ST capability is in learning — do not lead with this."],
  },

  result_wigmore_or_atomify: {
    result: true,
    recommendation: "Wigmore IT or Atomify",
    type: "partner",
    rationale:
      "For standard mid-market CS implementation in EMEA, both partners are viable. Wigmore IT offers broader depth; Atomify is well-suited for CS impl and TAM work at a slightly lower rate.",
    partners: ["Wigmore IT", "Atomify"],
    alternatives: [],
    caveats: ["Atomify has no CS Strategy capability — if strategic advisory is needed, default to Wigmore."],
  },

  result_wigmore_strategy: {
    result: true,
    recommendation: "Wigmore IT",
    type: "partner",
    rationale:
      "Wigmore holds primary CS Strategy capability and is the go-to advisory partner in EMEA.",
    partners: ["Wigmore IT"],
    alternatives: [],
    caveats: [],
  },

  result_wigmore_px: {
    result: true,
    recommendation: "Wigmore IT (secondary PX)",
    type: "partner",
    rationale:
      "Wigmore is the only EMEA partner with any PX capability, though it is secondary. Consider supplementing with internal PS resource for complex PX engagements.",
    partners: ["Wigmore IT"],
    alternatives: ["Internal PS supplementary resource"],
    caveats: [
      "PX is a secondary capability for Wigmore — validate scope before committing.",
      "For primary PX delivery in EMEA, this may need internal PS oversight.",
    ],
  },

  result_ncloud: {
    result: true,
    recommendation: "nCloud Integrators",
    type: "partner",
    rationale:
      "nCloud is the US equivalent of Wigmore IT — primary across CS Impl, CS Strategy, PX, and ST. Best all-round partner for US-based engagements.",
    partners: ["nCloud Integrators"],
    alternatives: ["Growth Molecules or Valuize if purely advisory"],
    caveats: ["Growing maturity — validate capacity for large enterprise programmes."],
  },

  result_ncloud_px: {
    result: true,
    recommendation: "nCloud Integrators",
    type: "partner",
    rationale:
      "nCloud holds primary PX Implementation capability in the US and is the strongest partner for PX-led engagements.",
    partners: ["nCloud Integrators"],
    alternatives: [],
    caveats: [],
  },

  result_ncloud_st: {
    result: true,
    recommendation: "nCloud Integrators",
    type: "partner",
    rationale:
      "nCloud has primary ST capability in the US. Well-suited for NPS programme rollouts and tracking configuration.",
    partners: ["nCloud Integrators"],
    alternatives: ["Enterprise Minds (secondary ST, boutique)"],
    caveats: [],
  },

  result_valuize_gm: {
    result: true,
    recommendation: "Valuize or Growth Molecules",
    type: "partner",
    rationale:
      "Both are US-based CS Strategy specialists. Valuize positions as architects-not-delivery; Growth Molecules has strong enterprise advisory focus with limited scale.",
    partners: ["Valuize", "Growth Molecules"],
    alternatives: ["nCloud Integrators if strategy needs to lead into delivery"],
    caveats: [
      "Growth Molecules has limited delivery scale — assess team size needed.",
      "Valuize does not do hands-on delivery — ensure customer expectation is set accordingly.",
    ],
  },

  result_grazitti: {
    result: true,
    recommendation: "Grazitti",
    type: "partner",
    rationale:
      "Primary CC implementation partner. India-based with significantly lower rates (~$60/hr). Includes moderation capability. Best choice when cost is a constraint and offshore delivery is acceptable.",
    partners: ["Grazitti"],
    alternatives: ["iTalent Digital (US-based, stronger enterprise pedigree)"],
    caveats: ["Offshore model — ensure customer timezone and communication expectations are aligned."],
  },

  result_italent: {
    result: true,
    recommendation: "iTalent Digital",
    type: "partner",
    rationale:
      "Primary CC partner in the US with strong enterprise delivery capability. Preferred when on-shore delivery or US time zone is required.",
    partners: ["iTalent Digital"],
    alternatives: ["Grazitti (cost-optimised alternative)"],
    caveats: ["Rate information not publicly listed — confirm current pricing."],
  },

  result_italent_migration: {
    result: true,
    recommendation: "iTalent Digital",
    type: "partner",
    rationale:
      "iTalent has particular strength in data migration for CC. Preferred for US-based CC migration engagements.",
    partners: ["iTalent Digital"],
    alternatives: ["Grazitti (cost-optimised)"],
    caveats: [],
  },

  result_t2s: {
    result: true,
    recommendation: "T2S Solutions",
    type: "partner",
    rationale:
      "Netherlands-based partner specialising exclusively in CC migration. Ideal for Benelux and broader EMEA CC migration engagements.",
    partners: ["T2S Solutions"],
    alternatives: ["Grazitti (if cost-sensitive or broader geographic reach needed)"],
    caveats: ["CC migration is their only capability — do not use for implementation or CS work."],
  },

  result_grazitti_migration: {
    result: true,
    recommendation: "Grazitti",
    type: "partner",
    rationale:
      "Grazitti handles both CC implementation and migration at low cost. Good choice for global or cost-sensitive migration programmes.",
    partners: ["Grazitti"],
    alternatives: ["T2S Solutions (EMEA migration specialist)", "iTalent Digital (US)"],
    caveats: ["Offshore delivery — align on communication cadence and timezone expectations."],
  },

  result_espeut: {
    result: true,
    recommendation: "Espeut Consulting",
    type: "partner",
    rationale:
      "Program management specialists. The go-to partner when a customer needs PMO, governance frameworks, or executive programme oversight rather than platform implementation.",
    partners: ["Espeut Consulting"],
    alternatives: ["Internal PS (if programme management is part of a larger engagement)"],
    caveats: ["Highest rate in the network at $200/hr — ensure scope justifies cost."],
  },

  result_st_emea: {
    result: true,
    recommendation: "Wigmore IT (learning) or Enterprise Minds",
    type: "partner",
    rationale:
      "ST coverage in EMEA is thin. Wigmore IT has ST in learning; Enterprise Minds has secondary ST but is US-based. Consider supplementing with internal PS resource.",
    partners: ["Wigmore IT", "Enterprise Minds"],
    alternatives: ["Internal PS resource for complex ST programmes"],
    caveats: [
      "Wigmore ST capability is still maturing — assess readiness for the specific scope.",
      "Enterprise Minds is boutique and US-based — confirm EMEA availability.",
    ],
  },

  result_nxt_internal: {
    result: true,
    recommendation: "Internal PS",
    type: "internal",
    rationale:
      "No partners currently hold NXT-specific expertise. Internal PS should own NXT engagements until partner capability is developed.",
    partners: [],
    alternatives: [],
    caveats: ["Monitor partner pipeline — NXT expertise may emerge from Wigmore or nCloud."],
  },

  result_internal_apac: {
    result: true,
    recommendation: "Internal PS",
    type: "internal",
    rationale:
      "No active partners cover India or APAC regions. Internal PS resource should be used, or consider whether Grazitti (India-based) could be positioned depending on the capability needed.",
    partners: [],
    alternatives: ["Grazitti for CC-specific work in the region"],
    caveats: ["Grazitti is India-based and could serve regional engagements for CC scope only."],
  },
};

export const STARTING_NODE = "arr";
