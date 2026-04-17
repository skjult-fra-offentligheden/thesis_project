// The architectural core of Principle 1: requirement provenance is a
// tagged variant in the type system, not a runtime flag or a colour
// applied at render time. Every Grant carries one of these as its
// `provenance` field, and the visual encoding renders the variant.

export type LegalRequirement = {
  kind: 'legal';
  id: string;
  label: string;
  citation: {
    instrument: string;   // e.g. "EU Sanctions Regulation 833/2014"
    article: string;      // e.g. "Art. 3"
    jurisdiction: string; // e.g. "EU", "US-OFAC"
  };
  rationale: string;
};

export type OrganisationalRequirement = {
  kind: 'organisational';
  id: string;
  label: string;
  source: {
    setBy: string;        // e.g. "Everllence Compliance", "Customer Admin"
    policyRef?: string;
  };
  rationale: string;
};

export type Requirement = LegalRequirement | OrganisationalRequirement;
