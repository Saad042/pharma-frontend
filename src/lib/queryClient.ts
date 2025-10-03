import { QueryClient, QueryFunction } from "@tanstack/react-query";

export function parseErrorResponse(errorData: any): string {
  // Handle non_field_errors
  if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
    return errorData.non_field_errors.join(", ");
  }

  // Handle field-specific errors
  const fieldErrors: string[] = [];
  for (const [field, messages] of Object.entries(errorData)) {
    if (Array.isArray(messages)) {
      fieldErrors.push(`${field}: ${messages.join(", ")}`);
    } else if (typeof messages === "string") {
      fieldErrors.push(`${field}: ${messages}`);
    }
  }

  if (fieldErrors.length > 0) {
    return fieldErrors.join("; ");
  }

  // Fallback to raw JSON
  return JSON.stringify(errorData);
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;

    try {
      const errorData = await res.json();
      errorMessage = parseErrorResponse(errorData);
    } catch (parseError) {
      // If JSON parsing fails, try to get text or use status
      try {
        errorMessage = await res.text();
      } catch {
        errorMessage = res.statusText || `HTTP ${res.status}`;
      }
    }

    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem("access_token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const headers: Record<string, string> = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem("access_token");
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    const url = queryKey.join("/") as string;
    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(fullUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
