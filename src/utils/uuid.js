/**
 * Safe UUID v4 generator.
 *
 * `crypto.randomUUID()` is only exposed in secure contexts (HTTPS / localhost).
 * When this app is served over plain HTTP from a non-localhost IP (e.g. ECS
 * demo on http://43.110.x.x:3271/), the browser keeps `crypto` defined but
 * removes `randomUUID` — calling it raises "crypto.randomUUID is not a function".
 *
 * This helper prefers the native cryptographic implementation when available,
 * then falls back to a Math.random()-based UUID v4. The fallback is NOT
 * cryptographically random — it's only used for opaque session ids that
 * don't need security guarantees. Anything actually security-sensitive
 * (CSRF tokens, etc.) should not use this helper.
 */
export function safeUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  // Math.random fallback: RFC 4122 v4 layout, no crypto strength.
  // Pattern xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y is [89ab].
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
