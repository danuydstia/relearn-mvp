import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LearningInvitation from '../components/dashboard/LearningInvitation.jsx'
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx'
import LearningPerformance from '../components/dashboard/LearningPerformance.jsx'
import RecentLearning from '../components/dashboard/RecentLearning.jsx'
import YourCommunity from '../components/dashboard/YourCommunity.jsx'
import ProgressAchievements from '../components/dashboard/ProgressAchievements.jsx'
import UploadMaterialModal from '../components/materials/UploadMaterialModal.jsx'
import { ACCEPTED_MATERIAL_TYPES, listMaterials, uploadMaterial } from '../lib/materials'
import { api } from '../lib/api' // Pastikan path ini sesuai dengan file axios Anda

export default function DashboardPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const pollingRef = useRef(null) // Ref untuk menyimpan setInterval agar bisa di-clear

  const [materials, setMaterials] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingName, setUploadingName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  useEffect(() => {
    let alive = true
    listMaterials()
      .then((data) => alive && setMaterials(data))
      .catch(() => alive && setMaterials(null))
    return () => {
      alive = false
      // Bersihkan interval jika user pindah halaman saat proses berjalan
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const openUploadPicker = () => fileInputRef.current?.click()

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setUploadingName(file.name)
    setUploadError('')
    
    try {
      // 1. Upload file. Laravel akan membalas dengan status 'pending' (sangat cepat)
      const material = await uploadMaterial(file)
      
      if (material.status === 'failed') {
        setUploadError('AI gagal memproses dokumen. Silakan coba lagi.')
        setUploading(false)
        return
      }

      // 2. Mulai Polling untuk mengecek status ke Laravel
      startPolling(material.id)
      
    } catch (err) {
      const res = err.response
      let errorMsg = 'Upload failed. Please try again.'
      
      if (res?.data?.errors?.file?.[0]) {
        errorMsg = res.data.errors.file[0]
      } else if (res?.data?.message) {
        errorMsg = res.data.message
      }
      
      setUploadError(errorMsg)
      setUploading(false)
    }
  }

  // Fungsi untuk mengecek status ke database Laravel
  const startPolling = (materialId) => {
    let attempts = 0
    const maxAttempts = 100 // ~5 menit (100 x 3 detik)

    // Hapus interval lama jika ada
    if (pollingRef.current) clearInterval(pollingRef.current)

    pollingRef.current = setInterval(async () => {
      attempts++
      
      // Jika melebihi 5 menit, hentikan
      if (attempts > maxAttempts) {
        clearInterval(pollingRef.current)
        setUploadError('Proses memakan waktu terlalu lama. Silakan cek halaman Materials nanti.')
        setUploading(false)
        return
      }

      try {
        // Panggil API GET /materials/{id}
        const res = await api.get(`/materials/${materialId}`)
        // Sesuaikan dengan struktur response Laravel Anda (biasanya di res.data.data atau res.data)
        const material = res.data.data || res.data 

        // ==========================================
        // TAMBAHKAN CONSOLE.LOG DI SINI
        // ==========================================
        console.log("🔄 CEK STATUS:", material.status, material) 

        if (material.status === 'processed') {
          // SUKSES! Hentikan polling dan redirect
          clearInterval(pollingRef.current)
          setUploading(false)
          setUploadingName('')
          setIsUploadModalOpen(false)
          navigate(`/materials/${materialId}/learning-path`)
          
        } else if (material.status === 'failed') {
          // GAGAL! Hentikan polling dan tampilkan error
          clearInterval(pollingRef.current)
          setUploadError('AI gagal memproses dokumen. Silakan coba lagi.')
          setUploading(false)
        }
        // Jika masih 'pending', biarkan interval berjalan (tidak melakukan apa-apa)
      } catch (err) {
        // ==========================================
        // TAMBAHKAN JUGA CONSOLE.ERROR DI SINI UNTUK LIHAT JIKA API GAGAL
        // ==========================================
        console.error("❌ POLLING ERROR:", err.response?.data || err.message)
      }
    }, 3000) // Cek setiap 3 detik
  }


  return (
    <div className="flex w-full flex-col bg-[#f7f7f2] px-6 pt-7 pb-8 md:px-8 md:py-8 lg:px-10 lg:pt-9 lg:pb-7">
      <div className="flex w-full max-w-[1128px] flex-col gap-8">
        <LearningInvitation onNewSession={() => setIsUploadModalOpen(true)} />

        {/* Tampilkan error di dashboard jika upload gagal di luar modal */}
        {uploadError && !isUploadModalOpen && (
          <p className="text-[13px] font-bold text-[#b42318]" role="alert">
            {uploadError}
          </p>
        )}

        <ContinueLearning />
        <LearningPerformance />

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,420fr)_minmax(0,320fr)_minmax(0,300fr)]">
          <RecentLearning materials={materials} className="md:col-span-2 lg:col-span-1" />
          <YourCommunity />
          <ProgressAchievements />
        </div>

        <p className="w-full text-[11px] font-black text-[#62665c] opacity-80">
          Example student data · For design review only
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MATERIAL_TYPES}
          className="hidden"
          onChange={handleFileSelected}
        />

        {/* Kirim state uploading ke Modal */}
        <UploadMaterialModal
          isOpen={isUploadModalOpen}
          onClose={() => !uploading && setIsUploadModalOpen(false)} // Cegah close saat uploading
          onChooseFile={openUploadPicker}
          uploading={uploading}
          uploadingName={uploadingName}
          uploadError={uploadError}
        />
      </div>
    </div>
  )
}