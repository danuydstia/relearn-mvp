import { api } from './api'

/**
 * Aggregates for the admin dashboard (design 10:62423).
 * Revenue, AI usage and reports have no backing table yet, so they stay as
 * illustrative content on the page.
 */
export async function fetchAdminOverview() {
  const res = await api.get('/admin/overview')
  return res.data
}

/**
 * One page of accounts for the admin Users screen (design 10:62689).
 *
 * `params` carries the search text, the role/plan/status filters, the sort
 * column and direction, and the page window. Empty values are dropped so the
 * request only sends what the admin actually narrowed by.
 */
export async function fetchAdminUsers(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined,
    ),
  )

  const res = await api.get('/admin/users', { params: query })
  return res.data
}
