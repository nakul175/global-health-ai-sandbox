export type Session = {
  access_token: string;
  context_id: string;
  display_name: string;
  membership_id: string;
  role: string;
};
export type ProgrammeData = {
  code: string;
  name: string;
  description: string;
  owner_membership_ref: string;
  country_codes: string[];
  mode: "synthetic_research" | "retrospective_evaluation";
  starts_at: string;
  ends_at: string;
};
export type Summary = {
  id: string;
  domain: string;
  title: string;
  version: number;
  state: string;
  classification: string;
  schema_version: string;
};
export type Programme = Summary & {
  payload: { kind: "Programme"; data: ProgrammeData };
};
export type Restrictions = {
  holds: { type: string; applied_at: string }[];
  can_edit: boolean;
};
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public correlation: string,
  ) {
    super(message);
  }
}
export class Api {
  private pending = new Set<AbortController>();
  constructor(private session: Session) {}
  close() {
    for (const controller of this.pending) controller.abort();
    this.pending.clear();
  }
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    this.pending.add(controller);
    const timeout = setTimeout(() => controller.abort("timeout"), 15000);
    try {
      const response = await fetch(path, {
        ...options,
        signal: controller.signal,
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${this.session.access_token}`,
          "X-Context-Id": this.session.context_id,
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });
      const data = await response.json();
      if (!response.ok)
        throw new ApiError(
          response.status,
          data.error?.code ?? "E_DEPENDENCY",
          data.error?.message ?? "The request could not be completed.",
          data.error?.correlation_id ?? "",
        );
      return data as T;
    } catch (error) {
      if (controller.signal.reason === "timeout")
        throw new ApiError(
          0,
          "E_UNKNOWN_OUTCOME",
          "The request timed out. Its outcome is unknown. Retry the same unchanged action safely.",
          "",
        );
      if (
        error instanceof TypeError &&
        options.method &&
        options.method !== "GET"
      )
        throw new ApiError(
          0,
          "E_UNKNOWN_OUTCOME",
          "Connection lost. The save outcome is unknown; retry this unchanged action safely.",
          "",
        );
      throw error;
    } finally {
      clearTimeout(timeout);
      this.pending.delete(controller);
    }
  }
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Connection unavailable. Try again.";
}
