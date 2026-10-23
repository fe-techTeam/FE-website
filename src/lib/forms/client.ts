export type FormSubmitResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function postJson(url: string, body: Record<string, unknown>): Promise<FormSubmitResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };

    if (!response.ok || !data.ok) {
      return { ok: false, error: data.error || "Something went wrong. Please try again." };
    }

    return { ok: true, message: data.message || "Submitted successfully." };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}

export async function postFormData(url: string, body: FormData): Promise<FormSubmitResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      body,
    });

    const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };

    if (!response.ok || !data.ok) {
      return { ok: false, error: data.error || "Something went wrong. Please try again." };
    }

    return { ok: true, message: data.message || "Submitted successfully." };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}
