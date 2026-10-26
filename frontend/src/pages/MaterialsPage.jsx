import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, LoaderCircle, CircleAlert, ArrowRight, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Pagination from '../components/materials/Pagination.jsx'
import { api } from '../lib/api'

const PAGE_SIZE = 9

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null) // State untuk animasi hapus

  // Ambil data dari API Laravel
  useEffect(() => {
    let alive = true
    api.get('/materials')
      .then((res) => {
        if (alive) {
          const fetchedMaterials = res.data.data || res.data || []
          setMaterials(fetchedMaterials)
        }
      })
      .catch((err) => {
        console.error("Gagal memuat materials:", err)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => { alive = false }
  }, [])

  // Fungsi untuk menghapus materi
  const handleDelete = async (id) => {
    // Konfirmasi sebelum menghapus
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus materi ini? Semua modul, topik, dan progres belajar Anda akan hilang secara permanen.")
    if (!confirm) return

    setDeletingId(id)
    try {
      // Panggil API DELETE
      await api.delete(`/materials/${id}`)
      
      // Hapus dari state agar UI langsung terupdate tanpa reload
      setMaterials((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus materi. Silakan coba lagi.")
    } finally {
      setDeletingId(null)
    }
  }

  // Filter berdasarkan pencarian
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return materials
    
    return materials.filter((m) => 
      (m.title && m.title.toLowerCase().includes(q)) || 
      (m.file_type && m.file_type.toLowerCase().includes(q))
    )
  }, [query, materials])

  // Pagination
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  // Helper untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 bg-[#f7f7f2] px-6 pt-9 pb-10">
      <div className="flex w-full flex-col gap-6">
        <header className="flex w-full flex-col gap-0.5">
          <h1 className="text-[28px] leading-[40px] font-black text-[#171916]">Materials</h1>
          <p className="text-[13px] leading-[20px] font-bold text-[#62665c]">
            Manage your uploaded materials and learning paths
          </p>
        </header>

        <label className="relative block w-full">
          <span className="sr-only">Search your materials</span>
          <Search
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 text-[#62665c]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search your materials..."
            className="h-11 w-full rounded-[8px] border-2 border-solid border-[#171916] bg-white pr-[14px] pl-10 text-[13px] font-bold text-[#171916] placeholder:font-black placeholder:text-[#62665c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
          />
        </label>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="flex h-[104px] w-full items-center justify-center px-4">
          <LoaderCircle className="animate-spin text-[#171916]" size={24} />
        </Card>
      )}

      {/* Empty State */}
      {!loading && total === 0 && (
        <Card className="flex h-[104px] w-full items-center justify-center px-4 text-center">
          <p className="text-[14px] leading-[22px] font-bold text-[#62665c]">
            {query.trim() ? 'No materials match your search' : 'You haven\'t uploaded any materials yet.'}
          </p>
        </Card>
      )}

      {/* Grid Materials */}
      {!loading && total > 0 && (
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((material) => {
            const isProcessed = material.status === 'processed'
            const isFailed = material.status === 'failed'
            const isPending = material.status === 'pending'
            const isDeleting = deletingId === material.id

            return (
              <Card 
                key={material.id} 
                className={`group flex flex-col justify-between gap-4 p-5 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(23,25,22,1)] ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex flex-col gap-3">
                  {/* Header Card */}
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border-2 border-solid border-[#171916] bg-[#d5f35b]">
                      <FileText size={20} className="text-[#171916]" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="rounded-[4px] border border-solid border-[#171916] bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider">
                        {material.file_type || 'FILE'}
                      </span>
                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleDelete(material.id)}
                        disabled={isDeleting}
                        title="Hapus materi"
                        className="flex size-7 items-center justify-center rounded-[4px] border border-transparent text-[#dc2626] transition-colors hover:border-[#dc2626] hover:bg-[#fff5f2]"
                      >
                        {isDeleting ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Title & Date */}
                  <div className="flex flex-col gap-1">
                    <h3 className="line-clamp-2 text-[16px] font-black leading-tight text-[#171916]">
                      {material.title || 'Untitled Material'}
                    </h3>
                    <p className="text-[11px] font-medium text-[#62665c]">
                      Uploaded {formatDate(material.created_at)}
                    </p>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="mt-2 flex items-center justify-between border-t-2 border-solid border-[#171916]/10 pt-4">
                  {/* Badge Status */}
                  <div className="flex items-center gap-1.5">
                    {isProcessed && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-[#059669]">
                        <div className="size-2 rounded-full bg-[#059669]" /> Ready
                      </span>
                    )}
                    {isPending && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-[#2563eb]">
                        <LoaderCircle size={12} className="animate-spin" /> Processing
                      </span>
                    )}
                    {isFailed && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-[#dc2626]">
                        <CircleAlert size={12} /> Failed
                      </span>
                    )}
                  </div>

                  {/* Button Action */}
                  {isProcessed ? (
                    <Link
                      to={`/materials/${material.id}/learning-path`}
                      className="flex items-center gap-1 text-[12px] font-black text-[#405c04] hover:underline"
                    >
                      Open <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="text-[12px] font-bold text-[#94a3b8] cursor-not-allowed">
                      Not ready
                    </span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          className="mt-auto pt-6"
          page={currentPage}
          pageCount={pageCount}
          from={start + 1}
          to={start + visible.length}
          total={total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}