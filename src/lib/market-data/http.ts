export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...init?.headers,
    },
    next: {
      revalidate: 300,
      ...init?.next,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Request failed ${response.status}: ${body.slice(0, 240)}`);
  }

  return (await response.json()) as T;
}

