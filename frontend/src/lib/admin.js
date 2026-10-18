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
