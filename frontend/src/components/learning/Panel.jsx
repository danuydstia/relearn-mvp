import Card from '../ui/Card.jsx'

/**
 * Panel — kartu putih layar learning (border 2px ink, radius 8).
 * Sekarang tampilannya sama persis dengan Card dashboard, jadi cukup
 * meneruskan ke Card. Nama Panel dipertahankan supaya import lama tetap jalan.
 */
export default function Panel({ className = '', children, ...props }) {
  return (
    <Card className={className} {...props}>
      {children}
    </Card>
  )
}