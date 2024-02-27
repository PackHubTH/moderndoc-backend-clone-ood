export type ApiResponse<T> = {
  data: T | unknown
  error?: unknown
  message?: string
}
