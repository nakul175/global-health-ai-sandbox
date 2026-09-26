import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Api,
  ApiError,
  errorMessage,
  type Programme,
  type ProgrammeData,
  type Restrictions,
  type Session,
  type Summary,
} from "./api";
import "./styles.css";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="m9 5 7 7-7 7" />,
    back: <path d="m15 5-7 7 7 7" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    flask: (
      <>
        <path d="M9 3h6M10 3v6L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3M7 15h10" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7v1" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    edit: (
      <>
        <path d="m16 3 5 5L9 20l-6 1 1-6zM13 6l5 5" />
      </>
    ),
    logout: (
      <>
        <path d="M9 4H4v16h5M10 12h11m-5-5 5 5-5 5" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V4H4v12h4" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.grid}
    </svg>
  );
}
function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="globe" size={26} />
      </span>
      <span>
        Health AI<span className="brand-sub">GLOBAL SANDBOX</span>
      </span>
    </div>
  );
}
function Status({ state }: { state: string }) {
  return (
    <span className={`status ${state}`}>
      <span />
      {state.replaceAll("_", " ")}
    </span>
  );
}
function ErrorNotice({ error }: { error: unknown }) {
  return (
    <div className="error-notice" role="alert">
      <strong>{errorMessage(error)}</strong>
      {error instanceof ApiError && error.correlation && (
        <small>Reference: {error.correlation}</small>
      )}
    </div>
  );
}
function Dialog({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <header className="dialog-header">
        <div>
          <h2 id="dialog-title">{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
      </header>
      {children}
    </dialog>
  );
}
function Login({ onSession }: { onSession: (session: Session) => void }) {
  const [profiles, setProfiles] = useState<{ id: string; label: string }[]>([]),
    [profile, setProfile] = useState("A_PM"),
    [code, setCode] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>();
  useEffect(() => {
    fetch("/dev/profiles", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok)
          throw new Error(
            "This client requires the configured local development issuer.",
          );
        setProfiles((await r.json()).profiles);
      })
      .catch(setError);
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const r = await fetch("/dev/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Dev-Access-Code": code,
        },
        body: JSON.stringify({ profile }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message ?? "Sign-in failed.");
      setCode("");
      onSession(data);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-shell">
      <div className="login-story">
        <Brand />
        <div>
          <span className="eyebrow light">FROM POSSIBILITY TO EVIDENCE</span>
          <h1>
            A shared space.
            <br />A higher standard
            <br />
            for health AI.
          </h1>
          <p>
            Bring institutions, research programmes and responsible oversight
            together.
          </p>
          <div className="orbit">
            <Icon name="globe" size={210} />
            <span className="orbit-point one" />
            <span className="orbit-point two" />
          </div>
        </div>
        <span className="story-foot">
          Governed research · Institution-led access
        </span>
      </div>
      <main className="login-panel">
        <span className="badge">SYNTHETIC DEVELOPMENT</span>
        <h2>Enter your workspace</h2>
        <p>Choose a test identity to explore the first programme workflow.</p>
        {!!error && <ErrorNotice error={error} />}
        <form onSubmit={submit}>
          <label htmlFor="identity">Institution and role</label>
          <select
            id="identity"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <label htmlFor="access-code">Local access code</label>
          <input
            id="access-code"
            type="password"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <small className="hint">
            Use the code printed when the application starts.
          </small>
          <button className="primary full" disabled={busy || !profiles.length}>
            {busy ? "Signing in…" : "Enter workspace"}
            <Icon name="arrow" size={16} />
          </button>
        </form>
        <div className="login-note">
          <Icon name="shield" />
          <span>
            Synthetic institutions and research metadata only.
            <br />
            No patient data is included in this workspace.
          </span>
        </div>
      </main>
    </div>
  );
}
type Values = {
  name: string;
  code: string;
  description: string;
  countries: string;
  mode: ProgrammeData["mode"];
  classification: string;
  start: string;
  end: string;
};
const blank: Values = {
  name: "",
  code: "",
  description: "",
  countries: "ZZ",
  mode: "synthetic_research",
  classification: "internal",
  start: "",
  end: "",
};
function valuesFrom(p: Programme): Values {
  const d = p.payload.data;
  return {
    name: p.title,
    code: d.code,
    description: d.description,
    countries: d.country_codes.join(", "),
    mode: d.mode,
    classification: p.classification,
    start: d.starts_at.slice(0, 10),
    end: d.ends_at.slice(0, 10),
  };
}
function validateValues(v: Values) {
  const errors: Record<string, string> = {};
  if (!v.name.trim()) errors.name = "Enter a programme name.";
  if (!/^[A-Z][A-Z0-9_]{2,31}$/.test(v.code))
    errors.code =
      "Use 3–32 uppercase letters, numbers or underscores, starting with a letter.";
  if (!v.description.trim()) errors.description = "Describe the programme.";
  const countries = v.countries.split(",").map((s) => s.trim().toUpperCase());
  if (
    countries.some((c) => !/^[A-Z]{2}$/.test(c)) ||
    countries.length > 30 ||
    new Set(countries).size !== countries.length
  )
    errors.countries = "Use 1–30 unique two-letter codes, separated by commas.";
  if (!v.start) errors.start = "Choose a start date.";
  if (!v.end || v.end <= v.start)
    errors.end = "Choose an end date after the start date.";
  return errors;
}
function ProgrammeForm({
  api,
  session,
  current,
  onClose,
  onSaved,
}: {
  api: Api;
  session: Session;
  current?: Programme;
  onClose: () => void;
  onSaved: (p: Programme) => void;
}) {
  const [values, setValues] = useState<Values>(
      current ? valuesFrom(current) : blank,
    ),
    [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(),
    [version, setVersion] = useState(current?.version ?? 1),
    [conflict, setConflict] = useState<Programme>();
  const retry = useRef<{ body: string; key: string } | undefined>(undefined),
    summary = useRef<HTMLDivElement>(null),
    dirty = useRef(false);
  function change(key: keyof Values, value: string) {
    dirty.current = true;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }
  function close() {
    if (busy) return;
    if (
      dirty.current &&
      !window.confirm("Discard your unsaved programme changes?")
    )
      return;
    onClose();
  }
  const field = (key: keyof Values, label: string, type = "text") => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        type={type}
        value={values[key]}
        maxLength={key === "code" ? 32 : 200}
        onChange={(e) => change(key, e.target.value)}
        onBlur={() =>
          setErrors((e) => ({ ...e, [key]: validateValues(values)[key] ?? "" }))
        }
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        disabled={key === "code" && !!current}
      />
      {errors[key] && (
        <small id={`${key}-error`} className="field-error">
          {errors[key]}
        </small>
      )}
    </div>
  );
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const invalid = validateValues(values);
    setErrors(invalid);
    setError(undefined);
    if (Object.keys(invalid).length) {
      setTimeout(() => summary.current?.focus(), 0);
      return;
    }
    setBusy(true);
    const data: ProgrammeData = {
      code: values.code,
      name: values.name.trim(),
      description: values.description.trim(),
      owner_membership_ref:
        current?.payload.data.owner_membership_ref ?? session.membership_id,
      country_codes: values.countries
        .split(",")
        .map((c) => c.trim().toUpperCase()),
      mode: values.mode,
      starts_at: values.start + "T00:00:00Z",
      ends_at: values.end + "T00:00:00Z",
    };
    const body = JSON.stringify({
      title: values.name.trim(),
      ...(!current
        ? { classification: values.classification, schema_version: "1.1" }
        : {}),
      payload: { kind: "Programme", data },
    });
    const intent = body + version;
    if (retry.current?.body !== intent)
      retry.current = { body: intent, key: crypto.randomUUID() };
    try {
      const programme = await api.request<Programme>(
        "/v1/resources/ORG" + (current ? "/" + current.id : ""),
        {
          method: current ? "PATCH" : "POST",
          body,
          headers: {
            "Idempotency-Key": retry.current.key,
            ...(current ? { "If-Match": `"v${version}"` } : {}),
          },
        },
      );
      dirty.current = false;
      onSaved(programme);
    } catch (e) {
      if (e instanceof ApiError && e.code === "E_VERSION_CONFLICT" && current) {
        try {
          setConflict(
            await api.request<Programme>("/v1/resources/ORG/" + current.id),
          );
        } catch (e2) {
          setError(e2);
        }
      } else setError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      title={current ? "Edit programme" : "Create a programme"}
      subtitle={
        current
          ? `Editing version ${version}. Changes create a new saved version.`
          : "Define the purpose, scope and timing of your research."
      }
      onClose={close}
    >
      <form onSubmit={save} noValidate>
        <div className="dialog-body">
          {Object.values(errors).some(Boolean) && (
            <div className="error-notice" tabIndex={-1} ref={summary}>
              <strong>Check the following fields</strong>
              <ul>
                {Object.entries(errors)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <li key={k}>
                      <a
                        href={"#" + k}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(k)?.focus();
                        }}
                      >
                        {v}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {!!error && <ErrorNotice error={error} />}{" "}
          {conflict && (
            <div className="conflict" role="alert">
              <h3>A newer version is available</h3>
              <p>
                Your draft is preserved below. Review the current server values
                before choosing a version for your next save.
              </p>
              <dl>
                {Object.entries(valuesFrom(conflict)).map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
              <div className="button-row">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setValues(valuesFrom(conflict));
                    setVersion(conflict.version);
                    setConflict(undefined);
                    retry.current = undefined;
                  }}
                >
                  Load current values
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setVersion(conflict.version);
                    setConflict(undefined);
                    retry.current = undefined;
                  }}
                >
                  Keep my reviewed draft
                </button>
              </div>
            </div>
          )}
          {field("name", "Programme name")}
          <div className="form-grid">
            {field("code", "Programme code")}
            <div className="field">
              <label htmlFor="mode">Research mode</label>
              <select
                id="mode"
                value={values.mode}
                onChange={(e) => change("mode", e.target.value)}
              >
                <option value="synthetic_research">Synthetic research</option>
                <option value="retrospective_evaluation">
                  Retrospective evaluation
                </option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Purpose and description</label>
            <textarea
              id="description"
              rows={4}
              maxLength={2000}
              value={values.description}
              onChange={(e) => change("description", e.target.value)}
              onBlur={() =>
                setErrors((e) => ({
                  ...e,
                  description: validateValues(values).description ?? "",
                }))
              }
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <small className="field-error">{errors.description}</small>
            )}
            <small className="hint">
              Explain the programme’s aim. Do not include patient information.
            </small>
          </div>
          <div className="form-grid">
            {field("countries", "Country codes")}
            <div className="field">
              <label htmlFor="classification">Information classification</label>
              <select
                id="classification"
                value={values.classification}
                disabled={!!current}
                onChange={(e) => change("classification", e.target.value)}
              >
                <option value="internal">Internal</option>
                <option value="confidential">Confidential</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>
          <small className="hint country-hint">
            Use ZZ for a synthetic test scope. Dates below are recorded in UTC.
          </small>
          <div className="form-grid">
            {field("start", "Start date", "date")}
            {field("end", "End date", "date")}
          </div>
          <div className="inline-note">
            <Icon name="shield" size={18} />
            <span>
              Your active programme membership owns this draft. Research review
              and approval are separate delivery slices.
            </span>
          </div>
        </div>
        <footer className="dialog-footer">
          <button
            type="button"
            className="secondary"
            onClick={close}
            disabled={busy}
          >
            Cancel
          </button>
          <button className="primary" disabled={busy || !!conflict}>
            {busy ? "Saving…" : current ? "Save changes" : "Create programme"}
            <Icon name="arrow" size={16} />
          </button>
        </footer>
      </form>
    </Dialog>
  );
}
function SafetyForm({
  api,
  programme,
  onClose,
  onDone,
}: {
  api: Api;
  programme?: Programme;
  onClose: () => void;
  onDone: () => void;
}) {
  const [text, setText] = useState(""),
    [contact, setContact] = useState(""),
    [error, setError] = useState<unknown>(),
    [busy, setBusy] = useState(false);
  const retry = useRef<{ body: string; key: string } | undefined>(undefined);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError(new Error("Describe the concern."));
      return;
    }
    setBusy(true);
    setError(undefined);
    const body = JSON.stringify({
      context: { object_ref: null, expected_version: null },
      payload: {
        concern: text.trim(),
        ...(contact ? { contact } : {}),
        ...(programme ? { scope_refs: [programme.id] } : {}),
      },
    });
    if (retry.current?.body !== body)
      retry.current = { body, key: crypto.randomUUID() };
    try {
      await api.request("/v1/commands/RecordSafetyConcern", {
        method: "POST",
        body,
        headers: { "Idempotency-Key": retry.current.key },
      });
      onDone();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      title="Report a safety concern"
      subtitle={
        programme
          ? `Linked to ${programme.title}`
          : "You can report a concern without selecting a programme."
      }
      onClose={() => !busy && onClose()}
    >
      <form onSubmit={submit}>
        <div className="dialog-body">
          {!!error && <ErrorNotice error={error} />}
          <div className="field">
            <label htmlFor="concern">What happened?</label>
            <textarea
              id="concern"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={20000}
              required
            />
            <small className="hint">
              Describe the issue without including patient identifiers.
            </small>
          </div>
          <div className="field">
            <label htmlFor="contact">
              Contact information <span className="optional">(optional)</span>
            </label>
            <input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="inline-note">
            <Icon name="shield" />
            <span>
              This records the concern for review. It does not automatically
              pause a programme.
            </span>
          </div>
        </div>
        <footer className="dialog-footer">
          <button
            type="button"
            className="secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button className="primary" disabled={busy}>
            {busy ? "Submitting…" : "Submit concern"}
          </button>
        </footer>
      </form>
    </Dialog>
  );
}
function Workspace({
  session,
  onLogout,
}: {
  session: Session;
  onLogout: () => void;
}) {
  const api = useMemo(() => new Api(session), [session]);
  const [items, setItems] = useState<Summary[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState<unknown>();
  const [selected, setSelected] = useState<Programme>(),
    [restrictions, setRestrictions] = useState<Restrictions>(),
    [modal, setModal] = useState<"create" | "edit" | "safety" | "help">(),
    [message, setMessage] = useState(""),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const [canCreate, setCanCreate] = useState(false),
    [online, setOnline] = useState(navigator.onLine);
  const generation = useRef(0);
  const institution = session.display_name.split(" · ")[0];
  function showError(e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError") return;
    setError(e);
    if (e instanceof ApiError && e.status === 401)
      setMessage(
        "Your session expired. Sign out and sign in again to continue.",
      );
  }
  async function load(more = false) {
    setLoading(true);
    setError(undefined);
    const gen = generation.current;
    try {
      const page = await api.request<{
        items: Summary[];
        next_cursor: string | null;
      }>(
        "/v1/resources/ORG" +
          (more && cursor ? "?cursor=" + encodeURIComponent(cursor) : ""),
      );
      if (gen !== generation.current) return;
      setItems((old) => (more ? [...old, ...page.items] : page.items));
      setCursor(page.next_cursor);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    api
      .request<{ can_create_programme: boolean }>("/v1/session")
      .then((s) => setCanCreate(s.can_create_programme))
      .catch(showError);
    const yes = () => setOnline(true),
      no = () => setOnline(false);
    window.addEventListener("online", yes);
    window.addEventListener("offline", no);
    return () => {
      generation.current++;
      api.close();
      window.removeEventListener("online", yes);
      window.removeEventListener("offline", no);
    };
  }, [api]);
  async function open(id: string) {
    setLoading(true);
    setError(undefined);
    setRestrictions(undefined);
    try {
      const [programme, rights] = await Promise.all([
        api.request<Programme>("/v1/resources/ORG/" + id),
        api.request<Restrictions>("/v1/resources/ORG/" + id + "/restrictions"),
      ]);
      setSelected(programme);
      setRestrictions(rights);
      window.scrollTo(0, 0);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  }
  function saved(p: Programme) {
    setModal(undefined);
    setMessage(`Programme saved as version ${p.version}.`);
    load();
    open(p.id);
  }
  function logout() {
    generation.current++;
    api.close();
    setItems([]);
    setSelected(undefined);
    onLogout();
  }
  const shown = items.filter(
    (x) =>
      (filter === "all" || x.state === filter) &&
      x.title.toLowerCase().includes(query.toLowerCase()),
  );
  const date = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">YOUR WORKSPACE</div>
        <button
          className="institution"
          onClick={logout}
          aria-label="Switch institution or role"
        >
          <span className="institution-avatar">{institution[0]}</span>
          <span>
            {institution}
            <small>
              {session.role === "PM"
                ? "Programme manager"
                : session.role === "EV"
                  ? "Evaluator"
                  : session.role === "CS"
                    ? "Clinical safety"
                    : "Support"}
            </small>
          </span>
          <Icon name="arrow" size={15} />
        </button>
        <div className="nav-label">RESEARCH</div>
        <nav aria-label="Main navigation">
          <button
            className="nav-item selected"
            onClick={() => {
              setSelected(undefined);
              setError(undefined);
              load();
            }}
          >
            <Icon name="grid" />
            <span>Programmes</span>
            <span className="nav-dot" />
          </button>
          <button className="nav-item" onClick={() => setModal("safety")}>
            <Icon name="shield" />
            <span>Report a concern</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="region">
            <Icon name="globe" />
            <div>
              Regional workspace<small>test-region-1 · Synthetic data</small>
            </div>
          </div>
          <div className="foundation-note">
            <span className="tiny-dot" />
            Programme workflow · v0.1
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span className="breadcrumb">
            Workspace <Icon name="arrow" size={13} /> Programmes{" "}
            {selected && (
              <>
                <Icon name="arrow" size={13} />
                <span className="crumb-current">Details</span>
              </>
            )}
          </span>
          <div className="top-actions">
            <button
              className="icon-button mobile-safety"
              aria-label="Report a concern"
              onClick={() => setModal("safety")}
            >
              <Icon name="shield" />
            </button>
            <span className={`connection ${online ? "" : "offline"}`}>
              <span />
              {online ? "Connected" : "Offline"}
            </span>
            <button
              className="icon-button"
              onClick={() => setModal("help")}
              aria-label="Workspace help"
            >
              <Icon name="info" />
            </button>
            <button
              className="icon-button"
              onClick={logout}
              aria-label="Sign out"
            >
              <Icon name="logout" />
            </button>
            <span className="user-avatar" aria-label={session.role}>
              {session.role}
            </span>
          </div>
        </header>
        <main id="main-content">
          <div className="environment-strip">
            <span className="badge">DEVELOPMENT</span>
            <span>A protected space for synthetic research workflows.</span>
          </div>
          {message && (
            <div className="success-notice" role="status">
              <Icon name="check" size={18} />
              {message}
              <button
                className="icon-button"
                aria-label="Dismiss notification"
                onClick={() => setMessage("")}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
          {!online && (
            <div className="warning" role="status">
              You’re offline. Changes remain in this tab until you reconnect;
              they have not been saved.
            </div>
          )}
          {!!error && (
            <>
              <ErrorNotice error={error} />
              <button
                className="text-button"
                onClick={() => (selected ? open(selected.id) : load())}
              >
                Retry
              </button>
            </>
          )}
          {!selected ? (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">INSTITUTIONAL RESEARCH</span>
                  <h1>Programmes</h1>
                  <p>
                    Organise health AI research with clear purpose and
                    oversight.
                  </p>
                </div>
                {canCreate && (
                  <button
                    className="primary"
                    onClick={() => setModal("create")}
                  >
                    <Icon name="plus" size={18} />
                    New programme
                  </button>
                )}
              </div>
              <div className="stats">
                <div className="stat">
                  <span className="stat-icon teal">
                    <Icon name="grid" />
                  </span>
                  <div>
                    <span>Programmes loaded</span>
                    <strong>
                      {loading && !items.length ? "—" : items.length}
                      <small>In your permitted scope</small>
                    </strong>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon amber">
                    <Icon name="edit" />
                  </span>
                  <div>
                    <span>Draft programmes</span>
                    <strong>
                      {items.filter((x) => x.state === "draft").length}
                      <small>On this page</small>
                    </strong>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon blue">
                    <Icon name="shield" />
                  </span>
                  <div>
                    <span>Active programmes</span>
                    <strong>
                      {items.filter((x) => x.state === "active").length}
                      <small>On this page</small>
                    </strong>
                  </div>
                </div>
              </div>
              <section className="list-panel" aria-labelledby="directory-title">
                <div className="panel-heading">
                  <h2 id="directory-title">
                    Programme directory <span>{shown.length}</span>
                  </h2>
                  <button
                    className="text-button"
                    onClick={() => load()}
                    disabled={loading}
                  >
                    Refresh
                  </button>
                </div>
                <div className="toolbar">
                  <label className="search">
                    <Icon name="search" size={18} />
                    <input
                      aria-label="Filter loaded programmes"
                      placeholder="Filter loaded programmes…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <select
                    aria-label="Filter by programme state"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All states</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                {loading && !items.length ? (
                  <div className="empty" role="status">
                    <span className="spinner" />
                    Loading your programmes…
                  </div>
                ) : !shown.length ? (
                  <div className="empty">
                    <Icon name="flask" size={34} />
                    <h3>
                      {query || filter !== "all"
                        ? "No programmes match these filters"
                        : "No programmes in your scope yet"}
                    </h3>
                    <p>
                      {query || filter !== "all"
                        ? "Try another name or clear the state filter."
                        : "An authorised programme manager can create the first draft."}
                    </p>
                    {canCreate && !query && filter === "all" && (
                      <button
                        className="secondary"
                        onClick={() => setModal("create")}
                      >
                        Create programme
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Programme</th>
                          <th>State</th>
                          <th className="classification-col">Classification</th>
                          <th className="version-col">Version</th>
                          <th>
                            <span className="sr-only">Open</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shown.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="programme-cell">
                                <span className="programme-icon">
                                  <Icon name="flask" size={21} />
                                </span>
                                <div>
                                  <button
                                    className="record-link"
                                    onClick={() => open(p.id)}
                                  >
                                    {p.title}
                                  </button>
                                  <small>
                                    Institution programme · {p.id.slice(0, 8)}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <Status state={p.state} />
                            </td>
                            <td className="classification-col">
                              <span className="classification">
                                <Icon name="shield" size={14} />
                                {p.classification}
                              </span>
                            </td>
                            <td className="version-col">
                              <span className="version">v{p.version}</span>
                            </td>
                            <td>
                              <button
                                className="icon-button"
                                aria-label={`Open ${p.title}`}
                                onClick={() => open(p.id)}
                              >
                                <Icon name="arrow" size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <footer className="table-footer">
                  <span>
                    Only programmes delegated to your current context appear
                    here.
                  </span>
                  {cursor && (
                    <button
                      className="secondary"
                      onClick={() => load(true)}
                      disabled={loading}
                    >
                      {loading ? "Loading…" : "Load more"}
                    </button>
                  )}
                </footer>
              </section>
              <div className="guidance-card">
                <span className="guidance-icon">
                  <Icon name="shield" size={26} />
                </span>
                <div>
                  <h3>Good research starts with a clear scope</h3>
                  <p>
                    Set the programme’s purpose, ownership and time frame before
                    moving into study design.
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setModal("help")}
                >
                  About this release <Icon name="arrow" size={15} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="back-link"
                onClick={() => {
                  setSelected(undefined);
                  setRestrictions(undefined);
                  load();
                }}
              >
                <Icon name="back" size={15} />
                All programmes
              </button>
              <div className="page-heading details-heading">
                <div>
                  <div className="detail-meta">
                    <Status state={selected.state} />
                    <span className="version">Version {selected.version}</span>
                  </div>
                  <h1>{selected.title}</h1>
                  <p>
                    {selected.payload.data.code} · {institution}
                  </p>
                </div>
                {restrictions?.can_edit && (
                  <button className="primary" onClick={() => setModal("edit")}>
                    <Icon name="edit" size={17} />
                    Edit programme
                  </button>
                )}
              </div>
              {!!restrictions?.holds.length && (
                <div className="warning">
                  <Icon name="shield" />
                  <span>
                    <strong>Programme changes are on hold</strong>
                    <br />
                    {restrictions.holds.map((h) => h.type).join(", ")} hold
                    active. Contact the assigned authority for review.
                  </span>
                </div>
              )}
              <div className="details-grid">
                <section className="detail-card">
                  <div className="panel-heading">
                    <h2>Programme overview</h2>
                    <Icon name="flask" />
                  </div>
                  <div className="detail-content">
                    <span className="eyebrow">PURPOSE</span>
                    <p className="description">
                      {selected.payload.data.description}
                    </p>
                    <dl className="details-list">
                      <dt>Research mode</dt>
                      <dd>{selected.payload.data.mode.replaceAll("_", " ")}</dd>
                      <dt>Country scope</dt>
                      <dd>
                        {selected.payload.data.country_codes
                          .map((c) =>
                            c === "ZZ" ? "ZZ · Synthetic test scope" : c,
                          )
                          .join(", ")}
                      </dd>
                      <dt>Start date</dt>
                      <dd title={selected.payload.data.starts_at}>
                        {date(selected.payload.data.starts_at)} UTC
                      </dd>
                      <dt>End date</dt>
                      <dd title={selected.payload.data.ends_at}>
                        {date(selected.payload.data.ends_at)} UTC
                      </dd>
                      <dt>Classification</dt>
                      <dd className="capitalize">{selected.classification}</dd>
                      <dt>Owner</dt>
                      <dd>
                        {selected.payload.data.owner_membership_ref ===
                        session.membership_id
                          ? "Your programme membership"
                          : "Assigned programme membership"}
                      </dd>
                    </dl>
                  </div>
                </section>
                <div>
                  <section className="detail-card assurance">
                    <span className="assurance-icon">
                      <Icon name="shield" size={27} />
                    </span>
                    <h2>Governed from the start</h2>
                    <p>
                      Each saved change receives a new version, immutable
                      snapshot and audit record.
                    </p>
                    <div className="assurance-row">
                      <Icon name="check" size={16} />
                      Institution-scoped access
                    </div>
                    <div className="assurance-row">
                      <Icon name="check" size={16} />
                      Conflicting edits are checked
                    </div>
                    <div className="assurance-row">
                      <Icon name="check" size={16} />
                      Retries avoid duplicate changes
                    </div>
                    <button
                      className="secondary full"
                      onClick={() => setModal("safety")}
                    >
                      Report a concern
                    </button>
                  </section>
                  <section className="record-id">
                    <span>Record reference</span>
                    <div>
                      <code>{selected.id}</code>
                      <button
                        className="icon-button"
                        aria-label="Copy record reference"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(selected.id)
                            .then(() => setMessage("Record reference copied."))
                            .catch(() =>
                              setMessage(
                                "Select the record reference to copy it.",
                              ),
                            )
                        }
                      >
                        <Icon name="copy" size={17} />
                      </button>
                    </div>
                  </section>
                </div>
              </div>
              {!restrictions?.can_edit && !restrictions?.holds.length && (
                <div className="inline-note">
                  <Icon name="info" />
                  <span>
                    {loading
                      ? "Checking current permissions…"
                      : "This programme is read-only in your current context."}
                  </span>
                </div>
              )}
            </>
          )}
          <footer className="page-footer">
            <span>Global Health AI Sandbox</span>
            <span>Purpose-led research. Accountable evidence.</span>
          </footer>
        </main>
      </div>
      {(modal === "create" || modal === "edit") && (
        <ProgrammeForm
          api={api}
          session={session}
          current={modal === "edit" ? selected : undefined}
          onClose={() => setModal(undefined)}
          onSaved={saved}
        />
      )}
      {modal === "safety" && (
        <SafetyForm
          api={api}
          programme={selected}
          onClose={() => setModal(undefined)}
          onDone={() => {
            setModal(undefined);
            setMessage("Safety concern recorded. It is awaiting review.");
          }}
        />
      )}
      {modal === "help" && (
        <Dialog
          title="About this development release"
          onClose={() => setModal(undefined)}
        >
          <div className="dialog-body help-content">
            <p>
              This working slice supports scoped programme creation, reading and
              editing, with version conflicts, safe retries and safety concern
              intake.
            </p>
            <h3>Try a different perspective</h3>
            <p>
              Use the institution selector to sign out, then choose another
              synthetic institution or role. Each context is checked
              independently.
            </p>
            <h3>What comes next</h3>
            <p>
              Institution onboarding, independent study review, data access and
              resumable uploads remain in the implementation backlog.
            </p>
            <div className="inline-note">
              <Icon name="info" />
              <span>
                This is a local synthetic development workspace. Clinical use
                and production operation are not enabled.
              </span>
            </div>
          </div>
          <footer className="dialog-footer">
            <button className="primary" onClick={() => setModal(undefined)}>
              Got it
            </button>
          </footer>
        </Dialog>
      )}
    </div>
  );
}
function App() {
  const [session, setSession] = useState<Session>();
  return session ? (
    <Workspace
      key={session.context_id}
      session={session}
      onLogout={() => setSession(undefined)}
    />
  ) : (
    <Login onSession={setSession} />
  );
}
createRoot(document.getElementById("root")!).render(<App />);
