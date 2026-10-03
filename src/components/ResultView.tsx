import React, { useState, useEffect } from 'react';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  UploadCloud,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  BellRing,
  ArrowRight,
  FileCheck2,
  Lock,
  Flame,
  X,
  HelpCircle,
} from 'lucide-react';
import { DownloadAnimationModal } from './DownloadAnimationModal';

interface ResultViewProps {
  score: number;
  correctCount: number;
  incorrectCount: number;
  kkm: number;
  studentName: string;
  noPeserta: string;
  driveUploadUrl?: string;
  onDownloadEncryptedResult: () => void;
  onViewDiscussion?: () => void;
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  studentName,
  noPeserta,
  driveUploadUrl,
  onDownloadEncryptedResult,
  onRestart,
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [hasOpenedDrive, setHasOpenedDrive] = useState(false);
  const [showMandatoryModal, setShowMandatoryModal] = useState(true);
  const [showExitWarningModal, setShowExitWarningModal] = useState(false);

  const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const resultFileName = `HASIL_CBT_${noPeserta}_${cleanName}.cbt`;

  // Soft victory / completion chime audio cue
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.28); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.45); // C6
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, []);

  const handleStartDownload = () => {
    setIsDownloadModalOpen(true);
  };

  const handleCompleteDownload = () => {
    setHasDownloaded(true);
    onDownloadEncryptedResult();
  };

  const handleOpenDrive = () => {
    setHasOpenedDrive(true);
    if (driveUploadUrl) {
      const url = driveUploadUrl.startsWith('http') ? driveUploadUrl : `https://${driveUploadUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAttemptExit = () => {
    if (!hasDownloaded) {
      setShowExitWarningModal(true);
    } else {
      onRestart();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/95 fixed inset-0 z-40 overflow-y-auto p-3 sm:p-6 custom-scrollbar">
      {/* Ambient background lights */}
      <div className="fixed top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in p-5 sm:p-8 text-center relative border border-slate-100 my-auto space-y-5">
        {/* Top Floating Shimmering Alert Badge */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowMandatoryModal(true)}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>2 LANGKAH WAJIB SETELAH UJIAN</span>
            <span className="bg-white/25 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {hasDownloaded ? '1/2 Selesai' : '0/2 Selesai'}
            </span>
          </button>
        </div>

        {/* Header Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-200 animate-float-slow">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[2.5]" />
        </div>

        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-extrabold mb-2 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Hasil Ujian Sukses Dikunci &amp; Diamankan
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Ujian Telah Selesai!</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Terima kasih <span className="font-bold text-slate-800">{studentName}</span> (NIS: {noPeserta})
          </p>
        </div>

        {/* ANIMATED COMPULSORY CHECKLIST HERO BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 rounded-3xl shadow-xl text-left relative overflow-hidden border-2 border-amber-400/80 animate-pulse-glow">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          {/* Banner Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <h3 className="font-black text-xs sm:text-sm text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" /> WAJIB: Simpan &amp; Upload Jawaban
              </h3>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
              hasDownloaded && hasOpenedDrive
                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
            }`}>
              {hasDownloaded && hasOpenedDrive ? '✅ Tuntas 100%' : '⚠️ Belum Lengkap'}
            </span>
          </div>

          {/* Step 1: Download .cbt */}
          <div className="space-y-3">
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${
              hasDownloaded
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                : 'bg-slate-800/80 border-amber-400/70 shadow-lg'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                    hasDownloaded ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950'
                  }`}>
                    1
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-white">
                      Unduh Berkas Jawaban (.cbt)
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      Bukti otentik terenkripsi jawaban Anda (wajib disimpan).
                    </p>
                  </div>
                </div>
                {hasDownloaded ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Terunduh
                  </span>
                ) : (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md animate-bounce shrink-0">
                    WAJIB
                  </span>
                )}
              </div>

              <button
                onClick={handleStartDownload}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  hasDownloaded
                    ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/40'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-emerald-500/30 animate-pulse'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{hasDownloaded ? 'Unduh Ulang File (.cbt)' : '📥 Unduh File Jawaban (.cbt) Sekarang'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
              </button>
            </div>

            {/* Step 2: Upload to Google Drive */}
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${
              hasOpenedDrive
                ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-100'
                : 'bg-slate-800/80 border-indigo-500/40'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                    hasOpenedDrive ? 'bg-indigo-500 text-white' : 'bg-indigo-400 text-slate-950'
                  }`}>
                    2
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-white">
                      Upload ke Google Drive Guru
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      Kirim file <b className="text-amber-300">.cbt</b> yang baru diunduh ke folder Drive.
                    </p>
                  </div>
                </div>
                {hasOpenedDrive ? (
                  <span className="bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Dibuka
                  </span>
                ) : (
                  <span className="bg-indigo-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shrink-0">
                    LANGKAH 2
                  </span>
                )}
              </div>

              {driveUploadUrl ? (
                <button
                  onClick={handleOpenDrive}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:bg-indigo-700 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <UploadCloud className="w-4 h-4 animate-bounce" />
                  <span>Buka Google Drive &amp; Upload (.cbt)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </button>
              ) : (
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Link Drive belum diatur Guru. Serahkan file <b>.cbt</b> di perangkat Anda langsung ke Pengawas/Guru.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-1.5 text-slate-600 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Keterangan Keamanan File (.cbt)</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            File terenkripsi <b>{resultFileName}</b> berisi tanda tangan kriptografi identitas, waktu mulai-selesai, nilai, dan rekam jejak jawaban Anda yang sah untuk rekapitulasi nilai sekolah.
          </p>
        </div>

        {/* Exit Action Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleAttemptExit}
            className={`w-full min-h-[48px] font-extrabold py-3.5 px-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98 ${
              hasDownloaded
                ? 'bg-slate-900 hover:bg-slate-950 active:bg-black text-white'
                : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black'
            }`}
          >
            <LogOut className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {hasDownloaded
                ? 'Keluar dari Aplikasi (Kembali ke Halaman Utama)'
                : 'Selesaikan & Keluar (Pastikan Sudah Unduh)'}
            </span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400 pt-1">
          <span>create: </span>
          <a
            href="https://lynk.id/ajisosiologi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-bold text-blue-600"
          >
            @ajisosiologi
          </a>{' '}
          - Offline Secure Assessment System 2026
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 MANDATORY ACTION REMINDER MODAL WITH EYE-CATCHING ANIMATION */}
      {/* ========================================================================= */}
      {showMandatoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 w-full max-w-lg p-6 sm:p-8 text-center relative overflow-hidden space-y-5 animate-in zoom-in-95 duration-200">
            {/* Glowing ambient ring */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Icon Stage with Bounce Animation */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400 bg-amber-50 animate-spin duration-1000" />
              <div className="relative z-10 w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/40">
                <AlertTriangle className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-1 rounded-full shadow animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>

            {/* Title & Warning Message */}
            <div className="space-y-1.5">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                ⚠️ PERINGATAN WAJIB SETELAH UJIAN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                JANGAN LANGSUNG MENUTUP APLIKASI!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Halo <b className="text-slate-900">{studentName}</b>, sebelum Anda meninggalkan meja ujian atau menutup jendela browser, Anda <b>WAJIB</b> menyelesaikan 2 langkah berikut:
              </p>
            </div>

            {/* Step 1 & 2 Cards */}
            <div className="space-y-3 text-left">
              {/* Step 1 Card */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all ${
                  hasDownloaded
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-400 shadow-md animate-pulse'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span className="font-black text-xs sm:text-sm text-slate-900">
                      Unduh Berkas Jawaban (.cbt)
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase ${
                    hasDownloaded ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900 animate-bounce'
                  }`}>
                    {hasDownloaded ? '✅ Selesai' : 'Wajib Diunduh'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-3 leading-snug">
                  File ini adalah bukti fisik terenkripsi rekaman nilai &amp; jawaban Anda.
                </p>
                <button
                  type="button"
                  onClick={handleStartDownload}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md ${
                    hasDownloaded
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/30'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>{hasDownloaded ? 'Unduh Ulang File .cbt' : 'KLIK UNTUK UNDUH FILE (.cbt)'}</span>
                </button>
              </div>

              {/* Step 2 Card */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all ${
                  hasOpenedDrive
                    ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950'
                    : 'bg-slate-50 border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span className="font-black text-xs sm:text-sm text-slate-900">
                      Upload ke Google Drive Guru
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase ${
                    hasOpenedDrive ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {hasOpenedDrive ? '✅ Telah Dibuka' : 'Langkah 2'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-3 leading-snug">
                  Unggah file <b className="text-indigo-900">.cbt</b> ke link Google Drive yang telah disiapkan Guru.
                </p>
                {driveUploadUrl ? (
                  <button
                    type="button"
                    onClick={handleOpenDrive}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>BUKA GOOGLE DRIVE &amp; UPLOAD FILE</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                ) : (
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-500">
                    Link Drive belum disediakan Admin. Cukup unduh file di Langkah 1 &amp; serahkan langsung ke Guru.
                  </div>
                )}
              </div>
            </div>

            {/* Confirm & Dismiss Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowMandatoryModal(false)}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                  hasDownloaded
                    ? 'bg-slate-900 hover:bg-slate-950 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saya Mengerti &amp; Tutup Peringatan Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚨 EXIT CONFIRMATION SAFEGUARD MODAL (IF NOT DOWNLOADED YET) */}
      {/* ========================================================================= */}
      {showExitWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-500 w-full max-w-md p-6 sm:p-7 text-center relative overflow-hidden space-y-5 animate-shake">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-red-200 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <div className="space-y-1.5">
              <span className="bg-red-100 text-red-900 border border-red-300 font-mono font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                🚨 PERINGATAN: BELUM UNDUH JAWABAN
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Anda Belum Mengunduh File (.cbt)!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Jika Anda keluar tanpa mengunduh, Anda <b>tidak memiliki bukti sah rekaman pengerjaan ujian</b>. Sangat disarankan untuk mengunduh sekarang!
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowExitWarningModal(false);
                  handleStartDownload();
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
              >
                <Download className="w-4 h-4" />
                <span>📥 Unduh File Jawaban (.cbt) Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExitWarningModal(false);
                  onRestart();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Tetap Keluar Tanpa Mengunduh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📥 DOWNLOAD ANIMATION MODAL */}
      {/* ========================================================================= */}
      <DownloadAnimationModal
        isOpen={isDownloadModalOpen}
        title="Mengunduh Hasil Jawaban (.cbt)"
        subtitle="Memproses stempel digital &amp; enkripsi hasil ujian..."
        fileName={resultFileName}
        fileType="cbt"
        onComplete={handleCompleteDownload}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
