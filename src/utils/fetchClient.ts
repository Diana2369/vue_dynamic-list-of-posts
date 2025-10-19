/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

// a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method, headers: {} };

  if (data !== null && data !== undefined) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  await wait(300); // simulate delay

  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as unknown as T; // handle empty response
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Failed to parse JSON response');
  }
}

export const fetchClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
};
