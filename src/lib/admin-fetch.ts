export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, init);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisá tu conexión.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Tu sesión venció. Volvé a ingresar.");
    }
    throw new Error(
      payload?.error || `El servidor respondió con un error (${response.status}).`
    );
  }

  return payload as T;
}

export function sendJson<T>(input: string, method: "POST" | "PUT", body: unknown) {
  return fetchJson<T>(input, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
