import { useState, useRef } from 'react';
import { productLicences } from '../data/grants';
import { fleets } from '../data/fleets';
import { customerOrg } from '../data/users';
import type { Fleet } from '../data/fleets';
import type { FunctionGrant } from '../types/grants';

// ── Edit all badge tooltip text here ─────────────────────────────────────
// Field badges (Step 1 — legal requirements)
const FIELD_TOOLTIPS = {
  firstName:
    'Your full name is matched against official EU, UN and OFAC sanctions lists to verify that platform access can be granted.',
  lastName:
    'Your full name is matched against official EU, UN and OFAC sanctions lists to verify that platform access can be granted.',
  dateOfBirth:
    'Date of birth is used to disambiguate individuals with similar names on the sanctions list, reducing false positives.',
  company:
    'Company name is cross-referenced with the EU Dual-Use export control list (Regulation 2021/821) to verify no trade restrictions apply.',
  location:
    'Country of operation is used alongside company name for EU export control screening.',
  email:
    'Email is used to send the account invitation and serves as the login identifier on the platform.',
  department:
    'Used by Everllence to determine audit actions and may be used by your organisation for internal access management.',
  employeeRole:
    'Used by Everllence to determine audit actions and may be used by your organisation for internal access management.',
  expiryDate:
    'Without expiry date, the account will remain active for 1 year by default. Setting an expiry date can help ensure access is reviewed periodically.',
  address:
    'Placeholder — describe why the user\'s address is collected, e.g. for identity verification or legal correspondence.',
  postalCode:
    'Placeholder — postal code is used alongside address for identity verification and export control screening.',
  accountCountry:
    'Placeholder — the country where the account holder is based, used to determine applicable regulatory requirements.',
  phone:
    'Optional — phone number can be used for account recovery or support contact purposes.',
};

// Licence badges (Step 2 — organisational requirements)
const LICENCE_TOOLTIPS: Record<string, string> = {
  'lic-primeserv':
    'PrimeServ is Everllence’s core product, providing access to vessel data, dashboards, and alerts. All users must have this licence.',
  'lic-ai-service':
    'AI sercice provides access to AI-powered insights and recommendations. Describe the specific features or data this licence enables for the user.',
  'lic-extended-data-monitoring':
    'Extended data monitoring allows access to additional data sources and more frequent updates. such as real-time sensor data, historical archives, or third-party integrations.',
  'lic-spare-part-shop':
    'Spare Part Shop grants access to the Everllence marketplace for ordering vessel spare parts.',
  'lic-technical-documents':
    'Technical Documents licence allows users to access and manage technical documentation related to their vessels, such as manuals, certificates, and maintenance records.',
  'lic-fleet-manager':
    'Fleet Manager provides tools for managing multiple vessels, including fleet-wide analytics, reporting, and user access controls.',
};
// ─────────────────────────────────────────────────────────────────────────

// To demo the failed sanctions screen, use first name "Viktor" + last name "Petrov"
const SANCTIONS_FAIL_TRIGGER = { firstName: 'Viktor', lastName: 'Petrov' };

type WizardStep = 1 | 2 | 3;
type SanctionsStatus = 'checking' | 'passed' | 'failed';

interface FormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  postalCode: string;
  accountCountry: string;
  company: string;
  location: string;
  department: string;
  employeeRole: string;
  expiryDate: string;
  // Organisational
  email: string;
  phone: string;
  selectedLicenceIds: string[];
  assignedVesselIds: string[];
}

export function CreateUser() {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    postalCode: '',
    accountCountry: '',
    company: customerOrg.name,
    location: '',
    department: '',
    employeeRole: '',
    expiryDate: '',
    email: '',
    phone: '',
    selectedLicenceIds: ['lic-primeserv'],
    assignedVesselIds: [],
  });
  const [sanctionsStatus, setSanctionsStatus] = useState<SanctionsStatus>('checking');

  function toggleLicence(id: string) {
    if (id === 'lic-primeserv') return; // always on
    setForm((prev) => ({
      ...prev,
      selectedLicenceIds: prev.selectedLicenceIds.includes(id)
        ? prev.selectedLicenceIds.filter((x) => x !== id)
        : [...prev.selectedLicenceIds, id],
    }));
  }

  function toggleVessel(id: string) {
    setForm((prev) => ({
      ...prev,
      assignedVesselIds: prev.assignedVesselIds.includes(id)
        ? prev.assignedVesselIds.filter((x) => x !== id)
        : [...prev.assignedVesselIds, id],
    }));
  }

  function toggleFleet(fleet: Fleet) {
    const fleetVesselIds = fleet.vessels.map((v) => v.id);
    const allSelected = fleetVesselIds.every((id) =>
      form.assignedVesselIds.includes(id)
    );
    setForm((prev) => ({
      ...prev,
      assignedVesselIds: allSelected
        ? prev.assignedVesselIds.filter((id) => !fleetVesselIds.includes(id))
        : [...new Set([...prev.assignedVesselIds, ...fleetVesselIds])],
    }));
  }

  function goToStep3() {
    const willFail =
      form.firstName.trim().toLowerCase() === SANCTIONS_FAIL_TRIGGER.firstName.toLowerCase() &&
      form.lastName.trim().toLowerCase() === SANCTIONS_FAIL_TRIGGER.lastName.toLowerCase();
    setStep(3);
    setSanctionsStatus('checking');
    setTimeout(() => setSanctionsStatus(willFail ? 'failed' : 'passed'), 10000);
  }

  function resetWizard() {
    setForm({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      postalCode: '',
      accountCountry: '',
      company: customerOrg.name,
      location: '',
      department: '',
      employeeRole: '',
      expiryDate: '',
      email: '',
      phone: '',
      selectedLicenceIds: ['lic-primeserv'],
      assignedVesselIds: [],
    });
    setStep(1);
  }

  const step1Valid =
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.dateOfBirth.trim() !== '' &&
    form.accountCountry.trim() !== '' &&
    form.company.trim() !== '' &&
    form.location.trim() !== '';

  const step2Valid =
    form.email.includes('@') &&
    form.department.trim() !== '' &&
    form.employeeRole.trim() !== '';

  const selectedLicences = productLicences.filter((l) =>
    form.selectedLicenceIds.includes(l.id)
  );

  const assignedVessels = fleets
    .flatMap((f) => f.vessels)
    .filter((v) => form.assignedVesselIds.includes(v.id));

  return (
    <>
      <h1 className="page-title">Create user</h1>
      <p className="page-subtitle">
        Add a new employee to your organisation and assign their access.
      </p>

      <StepBar step={step} />

      <div className="wizard-body">
        {step === 1 && (
          <Step1
            form={form}
            setForm={setForm}
            onNext={() => setStep(2)}
            valid={step1Valid}
          />
        )}
        {step === 2 && (
          <Step2
            form={form}
            setForm={setForm}
            selectedLicences={selectedLicences}
            toggleLicence={toggleLicence}
            toggleVessel={toggleVessel}
            toggleFleet={toggleFleet}
            onNext={goToStep3}
            onBack={() => setStep(1)}
            valid={step2Valid}
          />
        )}
        {step === 3 && (
          <Step3
            form={form}
            selectedLicences={selectedLicences}
            assignedVessels={assignedVessels}
            status={sanctionsStatus}
            onBack={() => setStep(2)}
            onReset={resetWizard}
          />
        )}
      </div>
    </>
  );
}

/* ── Step bar ─────────────────────────────────────────────────────────── */

function StepBar({ step }: { step: WizardStep }) {
  return (
    <div className="wizard-steps">
      <StepDot num={1} label="Identity and screening" step={step} />
      <div className="wizard-step-connector" />
      <StepDot num={2} label="Access and licences" step={step} />
      <div className="wizard-step-connector" />
      <StepDot num={3} label="Final check." step={step} />
    </div>
  );
}

function StepDot({ num, label, step }: { num: number; label: string; step: WizardStep }) {
  const active = step === num;
  const done = step > num;
  return (
    <div className={`wizard-step${active ? ' active' : ''}${done ? ' done' : ''}`}>
      <div className="wizard-step-num">{done ? '✓' : num}</div>
      <div className="wizard-step-label">{label}</div>
    </div>
  );
}

/* ── Step 1: Legal requirements ───────────────────────────────────────── */

function Step1({
  form,
  setForm,
  onNext,
  valid,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void;
  valid: boolean;
}) {
  return (
    <div className="step1-layout">

      {/* Left: form */}
      <div className="step1-form">
        <div className="wizard-section legal-section">
          <p className="wizard-section-title">Identity</p>
          <p className="wizard-section-desc">Required for EU sanctions screening.</p>
          <div className="form-grid">
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">First name</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.firstName}>Sanctions screening</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="e.g. Jan"
              />
            </div>
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Last name</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.lastName}>Sanctions screening</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="e.g. Kowalski"
              />
            </div>
            <div className="form-field full">
              <div className="form-label-row">
                <label className="form-label">Date of birth</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.dateOfBirth}>Sanctions list match</span>
              </div>
              <input
                className="form-input legal-input"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
              />
            </div>
            <div className="form-field full">
              <div className="form-label-row">
                <label className="form-label">Address</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.address}>Optional</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="e.g. Strandvejen 100"
              />
            </div>
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Postal code</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.postalCode}>Optional</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                placeholder="e.g. 2900"
              />
            </div>
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Account country</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.accountCountry}>Regulatory scope</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.accountCountry}
                onChange={(e) => setForm((f) => ({ ...f, accountCountry: e.target.value }))}
                placeholder="e.g. Denmark"
              />
            </div>
          </div>
        </div>

        <div className="wizard-section legal-section">
          <p className="wizard-section-title">Organisation</p>
          <p className="wizard-section-desc">Required for EU export control verification.</p>
          <div className="form-grid">
            <div className="form-field full">
              <div className="form-label-row">
                <label className="form-label">Company name</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.company}>Export control check</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Imaginary Shipping A/S"
              />
            </div>
            <div className="form-field full">
              <div className="form-label-row">
                <label className="form-label">Location / country</label>
                <span className="field-why-badge" data-tooltip={FIELD_TOOLTIPS.location}>Export control check</span>
              </div>
              <input
                className="form-input legal-input"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Denmark"
              />
            </div>
          </div>
        </div>

        <div className="wizard-actions">
          <button className="btn btn-primary" onClick={onNext} disabled={!valid}>
            Continue to org. requirements →
          </button>
        </div>
      </div>

      {/* Right: info box */}
      <div className="step1-info">
        <div className="legal-info-box">
          <div className="legal-info-header">
            <span className="legal-info-icon">i</span>
            Why is this information required?
          </div>
          <div className="legal-info-body">
            <p>
              Everllence is required by EU law to ask for certain information.
              For user creation and management, Everllence needs additional
              information about the user who will use the platform.
            </p>
            <div className="legal-info-block">
              <div className="legal-info-block-label">Sanctions screening</div>
              <p>
                The name and date of birth are used to check against the
                official EU sanctions list, to comply with Article 215 TFEU of
                the EU-EC Treaty.
              </p>
            </div>
            <div className="legal-info-block">
              <div className="legal-info-block-label">Export control</div>
              <p>
                Certain products are prohibited from being exported. Your
                company name and location are used to check against the EU
                export control list (EU Dual-Use Regulation 2021/821).
              </p>
            </div>
            <div className="legal-info-block">
              <div className="legal-info-block-label">Organisational access</div>
              <p>
                Organisational data is used to set up the user. The permissions
                given depend on your organisation's licenses and the user's
                department and role.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Step 2: Organisational requirements ──────────────────────────────── */

function Step2({
  form,
  setForm,
  selectedLicences,
  toggleLicence,
  toggleVessel,
  toggleFleet,
  onNext,
  onBack,
  valid,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  selectedLicences: FunctionGrant[];
  toggleLicence: (id: string) => void;
  toggleVessel: (id: string) => void;
  toggleFleet: (fleet: Fleet) => void;
  onNext: () => void;
  onBack: () => void;
  valid: boolean;
}) {
  return (
    <>
      {/* Account type — readonly */}
      <div className="account-type-bar">
        <span className="account-type-label">Account type</span>
        <span className="account-type-badge">Employee</span>
        <span className="account-type-note">
          Superusers can only create employee accounts.
        </span>
      </div>

      {/* Email */}
      <div className="wizard-section">
        <p className="wizard-section-title">Contact</p>
        <p className="wizard-section-desc">
          Used to send the account invitation and for platform login.
        </p>
        <div className="form-grid">
          <div className="form-field full">
            <div className="form-label-row">
              <label className="form-label">Email</label>
              <span className="field-why-badge org-badge" data-tooltip={FIELD_TOOLTIPS.email}>Account setup</span>
            </div>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. jan.kowalski@company.com"
            />
          </div>
          <div className="form-field full">
            <div className="form-label-row">
              <label className="form-label">Phone number</label>
              <span className="field-why-badge org-badge" data-tooltip={FIELD_TOOLTIPS.phone}>Optional</span>
            </div>
            <input
              className="form-input"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +45 12 34 56 78"
            />
          </div>
        </div>
      </div>

      {/* User details */}
      <div className="wizard-section">
        <p className="wizard-section-title">User details</p>
        <p className="wizard-section-desc">
          Department and role determine which licences and access scopes apply to this user.
        </p>
        <div className="form-grid">
          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label">Department</label>
              <span className="field-why-badge org-badge" data-tooltip={FIELD_TOOLTIPS.department}>Org. setup</span>
            </div>
            <input
              className="form-input"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="e.g. Engineering"
            />
          </div>
          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label">Employee role</label>
              <span className="field-why-badge org-badge" data-tooltip={FIELD_TOOLTIPS.employeeRole}>Org. setup</span>
            </div>
            <input
              className="form-input"
              value={form.employeeRole}
              onChange={(e) => setForm((f) => ({ ...f, employeeRole: e.target.value }))}
              placeholder="e.g. Marine Engineer"
            />
          </div>
          <div className="form-field full">
            <div className="form-label-row">
              <label className="form-label">Account expiry</label>
              <span className="field-why-badge org-badge" data-tooltip={FIELD_TOOLTIPS.expiryDate}>Optional</span>
            </div>
            <input
              className="form-input"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Product licences */}
      <div className="wizard-section">
        <p className="wizard-section-title">Product licences</p>
        <p className="wizard-section-desc">
          Select the standalone Everllence products this user should have access
          to. Each licence must be covered by your organisation's subscription.
        </p>
        <div className="grant-grid">
          {productLicences.map((lic) => (
            <LicenceBadge
              key={lic.id}
              licence={lic}
              selected={form.selectedLicenceIds.includes(lic.id)}
              onToggle={() => toggleLicence(lic.id)}
            />
          ))}
        </div>
      </div>

      {/* Fleet / vessel assignment */}
      <div className="wizard-section">
        <p className="wizard-section-title">Fleet & vessel access</p>
        <p className="wizard-section-desc">
          Assign the user to whole fleets or individual vessels. They will only
          see data for vessels selected here.
        </p>
        <div className="fleet-selector">
          {fleets.map((fleet) => {
            const fleetVesselIds = fleet.vessels.map((v) => v.id);
            const selectedCount = fleetVesselIds.filter((id) =>
              form.assignedVesselIds.includes(id)
            ).length;
            const allSelected = selectedCount === fleet.vessels.length;
            const someSelected = selectedCount > 0 && !allSelected;

            return (
              <div key={fleet.id} className="fleet-group">
                <div className="fleet-header">
                  <div className="fleet-header-left">
                    <span className="fleet-name">{fleet.name}</span>
                    {selectedCount > 0 && (
                      <span className="fleet-count-badge">
                        {selectedCount}/{fleet.vessels.length}
                      </span>
                    )}
                  </div>
                  <button
                    className={`btn-fleet-all${allSelected ? ' active' : ''}${someSelected ? ' partial' : ''}`}
                    onClick={() => toggleFleet(fleet)}
                  >
                    {allSelected ? 'Deselect fleet' : 'Select fleet'}
                  </button>
                </div>

                <div className="vessel-list">
                  {fleet.vessels.map((vessel) => {
                    const selected = form.assignedVesselIds.includes(vessel.id);
                    return (
                      <div
                        key={vessel.id}
                        className={`vessel-row${selected ? ' selected' : ''}`}
                        onClick={() => toggleVessel(vessel.id)}
                      >
                        <div className={`vessel-checkbox${selected ? ' checked' : ''}`}>
                          {selected && '✓'}
                        </div>
                        <div className="vessel-name">{vessel.name}</div>
                        <div className="vessel-meta">
                          <span className="vessel-imo">IMO {vessel.imoNumber}</span>
                          <span className="vessel-type">{vessel.type}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wizard-actions">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!valid}>
          Run sanctions check →
        </button>
      </div>
    </>
  );
}

/* ── Step 3: Sanctions check ──────────────────────────────────────────── */

function Step3({
  form,
  selectedLicences,
  assignedVessels,
  status,
  onBack,
  onReset,
}: {
  form: FormState;
  selectedLicences: FunctionGrant[];
  assignedVessels: { id: string; name: string }[];
  status: SanctionsStatus;
  onBack: () => void;
  onReset: () => void;
}) {
  const [outlookOpen, setOutlookOpen] = useState(false);
  const fullName = `${form.firstName} ${form.lastName}`.trim();

  return (
    <>
      <div className="wizard-section">
        <p className="wizard-section-title">User summary</p>
        <div className="user-summary">
          <div className="user-summary-name">{fullName}</div>
          <div className="user-summary-email">{form.email}</div>
          <div className="user-summary-role">
            Role: <strong>Employee</strong>
            {form.company && (
              <span style={{ marginLeft: 12 }}>
                Company: <strong>{form.company}</strong>
              </span>
            )}
            {form.department && (
              <span style={{ marginLeft: 12 }}>
                Dept: <strong>{form.department}</strong>
              </span>
            )}
            {form.employeeRole && (
              <span style={{ marginLeft: 12 }}>
                Job title: <strong>{form.employeeRole}</strong>
              </span>
            )}
            {form.expiryDate && (
              <span style={{ marginLeft: 12 }}>
                Expires: <strong>{form.expiryDate}</strong>
              </span>
            )}
          </div>
          {selectedLicences.length > 0 && (
            <div className="user-summary-grants" style={{ marginTop: 8 }}>
              {selectedLicences.map((l) => (
                <span key={l.id} className="summary-grant-pill organisational">
                  {l.label}
                </span>
              ))}
            </div>
          )}
          {assignedVessels.length > 0 && (
            <div className="user-summary-grants" style={{ marginTop: 6 }}>
              {assignedVessels.map((v) => (
                <span key={v.id} className="summary-grant-pill vessel-pill">
                  {v.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="sanctions-body">
          {status === 'checking' && (
            <>
              <div className="sanctions-spinner" />
              <div className="sanctions-status">Running sanctions check…</div>
              <div className="sanctions-desc">
                Screening <strong>{fullName}</strong> against EU, OFAC, and UN
                restrictive measures lists.
              </div>
            </>
          )}
          {status === 'passed' && (
            <>
              <div className="sanctions-icon passed">✓</div>
              <div className="sanctions-status passed">Sanctions check passed</div>
              <div className="sanctions-desc">
                No matches found. The account for <strong>{fullName}</strong> has
                been created successfully.
              </div>
              <div className="wizard-actions" style={{ justifyContent: 'center', marginTop: 20 }}>
                <button className="btn btn-primary" onClick={onReset}>
                  Create another user
                </button>
              </div>
            </>
          )}
          {status === 'failed' && (
            <>
              <div className="sanctions-icon failed">✗</div>
              <div className="sanctions-status failed">Compliance check failed</div>
              <div className="sanctions-blocked-box">
                <p className="sanctions-blocked-main">
                  A required compliance check has prevented this account from being created.
                </p>
                <div className="sanctions-blocked-detail">
                  <div className="sanctions-ref-row">
                    <span className="sanctions-ref-label">Reference number</span>
                    <span className="sanctions-ref-value">X2s1</span>
                  </div>
                  <div className="sanctions-contact-row">
                    <span className="sanctions-ref-label">Contact support</span>
                    <button
                      className="sanctions-mail-btn"
                      onClick={() => setOutlookOpen(true)}
                    >
                      <MailIcon />
                      everllence@support.com
                    </button>
                  </div>
                </div>
              </div>
              <div className="wizard-actions" style={{ justifyContent: 'center', marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={onBack}>
                  ← Review details
                </button>
              </div>
              {outlookOpen && (
                <OutlookPopup onClose={() => setOutlookOpen(false)} />
              )}
            </>
          )}
        </div>
      </div>

      {status === 'checking' && (
        <div className="wizard-actions">
          <button className="btn btn-secondary" disabled>← Back</button>
        </div>
      )}
    </>
  );
}

/* ── Outlook popup ────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function OutlookPopup({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="outlook-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="outlook-modal" ref={ref}>
        <div className="outlook-modal-header">
          <div className="outlook-modal-title">
            <span className="outlook-logo">✉</span>
            Outlook
          </div>
          <button className="outlook-close" onClick={onClose}>✕</button>
        </div>
        <div className="outlook-modal-body">
          <p className="outlook-demo-label">Integration demo</p>
          <p>
            In production, clicking this button would open a pre-filled Outlook
            email addressed to <strong>everllence@support.com</strong> with the
            reference number <strong>X2s1</strong> included in the subject line.
          </p>
        </div>
        <div className="outlook-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Licence badge ────────────────────────────────────────────────────── */

function LicenceBadge({
  licence,
  selected,
  onToggle,
}: {
  licence: FunctionGrant;
  selected: boolean;
  onToggle: () => void;
}) {
  const provenance = licence.provenance;
  const locked = licence.id === 'lic-primeserv';
  // Primeserv is always blue regardless of provenance kind
  const colourClass = locked ? 'organisational' : provenance.kind;
  const source =
    provenance.kind === 'organisational'
      ? `${provenance.source.setBy}${provenance.source.policyRef ? ' · ' + provenance.source.policyRef : ''}`
      : provenance.kind === 'legal'
      ? `${provenance.citation.instrument} · ${provenance.citation.article}`
      : '';

  return (
    <div
      className={`grant-badge ${colourClass}${selected ? ' selected' : ''}${locked ? ' locked' : ''}`}
      data-tooltip={LICENCE_TOOLTIPS[licence.id] ?? ''}
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
    >
      {locked
        ? <span className="grant-badge-check">✓</span>
        : selected && <span className="grant-badge-check">✓</span>
      }
      <div className="grant-badge-label">
        {licence.label}
        {locked && <span className="grant-badge-locked-tag">Included</span>}
      </div>
      <div className="grant-badge-req">{provenance.label}</div>
      <div>
        <span className="grant-badge-type-tag">licence</span>
      </div>
      <div className="grant-badge-citation">{source}</div>
    </div>
  );
}
