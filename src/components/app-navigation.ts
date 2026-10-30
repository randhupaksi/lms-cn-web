import type { Route } from "next";
import {
  Activity,
  BookOpenCheck,
  BookOpenText,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  Database,
  GraduationCap,
  LayoutDashboard,
  School,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { UserRole } from "@/types/api";

export type NavigationItem = {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
};

export const navigation: Record<UserRole, NavigationItem[]> = {
  superadmin: [
    {
      href: "/dashboard",
      label: "Pusat kendali",
      icon: LayoutDashboard,
      group: "Pengawasan sekolah",
    },
    {
      href: "/superadmin/exams",
      label: "Kesiapan ujian",
      icon: BookOpenCheck,
      group: "Pengawasan sekolah",
    },
    {
      href: "/governance/requests",
      label: "Kotak keputusan",
      icon: ClipboardCheck,
      group: "Pengawasan sekolah",
    },
    {
      href: "/governance/actions",
      label: "Tindak lanjut",
      icon: ClipboardList,
      group: "Pengawasan sekolah",
    },
    {
      href: "/superadmin/calendar",
      label: "Kalender sekolah",
      icon: CalendarDays,
      group: "Akademik & mutu",
    },
    {
      href: "/admin/academics",
      label: "Data akademik",
      icon: School,
      group: "Akademik & mutu",
    },
    {
      href: "/superadmin/quality",
      label: "Kualitas data",
      icon: Database,
      group: "Akademik & mutu",
    },
    {
      href: "/superadmin/reports",
      label: "Laporan sekolah",
      icon: ChartNoAxesCombined,
      group: "Akademik & mutu",
    },
    {
      href: "/superadmin/users",
      label: "Pengguna & akses",
      icon: UsersRound,
      group: "Tata kelola",
    },
    {
      href: "/admin/monitoring",
      label: "Monitoring ujian",
      icon: Activity,
      group: "Tata kelola",
    },
    {
      href: "/teacher/results",
      label: "Hasil ujian",
      icon: GraduationCap,
      group: "Tata kelola",
    },
    {
      href: "/admin/audit",
      label: "Audit aktivitas",
      icon: ShieldCheck,
      group: "Tata kelola",
    },
    {
      href: "/superadmin/settings",
      label: "Pengaturan sekolah",
      icon: Settings2,
      group: "Tata kelola",
    },
  ],
  admin: [
    {
      href: "/dashboard",
      label: "Ringkasan",
      icon: LayoutDashboard,
      group: "Workspace",
    },
    {
      href: "/admin/users",
      label: "Pengguna",
      icon: UsersRound,
      group: "Data akademik",
    },
    {
      href: "/admin/academics",
      label: "Akademik",
      icon: School,
      group: "Data akademik",
    },
    {
      href: "/admin/monitoring",
      label: "Monitoring",
      icon: Activity,
      group: "Operasional",
    },
    {
      href: "/teacher/results",
      label: "Hasil ujian",
      icon: GraduationCap,
      group: "Operasional",
    },
    {
      href: "/admin/audit",
      label: "Audit aktivitas",
      icon: ShieldCheck,
      group: "Operasional",
    },
    {
      href: "/governance/requests",
      label: "Pengajuan jadwal",
      icon: ClipboardCheck,
      group: "Koordinasi sekolah",
    },
    {
      href: "/governance/actions",
      label: "Tindak lanjut saya",
      icon: ClipboardList,
      group: "Koordinasi sekolah",
    },
  ],
  principal: [
    {
      href: "/dashboard",
      label: "Pusat kendali",
      icon: LayoutDashboard,
      group: "Kepemimpinan sekolah",
    },
    {
      href: "/principal/exams",
      label: "Kesiapan ujian",
      icon: BookOpenCheck,
      group: "Kepemimpinan sekolah",
    },
    {
      href: "/governance/requests",
      label: "Kotak keputusan",
      icon: ClipboardCheck,
      group: "Kepemimpinan sekolah",
    },
    {
      href: "/governance/actions",
      label: "Tindak lanjut",
      icon: ClipboardList,
      group: "Kepemimpinan sekolah",
    },
    {
      href: "/principal/calendar",
      label: "Kalender sekolah",
      icon: CalendarDays,
      group: "Akademik & mutu",
    },
    {
      href: "/admin/academics",
      label: "Data akademik",
      icon: School,
      group: "Akademik & mutu",
    },
    {
      href: "/principal/quality",
      label: "Kualitas data",
      icon: Database,
      group: "Akademik & mutu",
    },
    {
      href: "/principal/reports",
      label: "Laporan sekolah",
      icon: ChartNoAxesCombined,
      group: "Akademik & mutu",
    },
    {
      href: "/principal/users",
      label: "Pengguna sekolah",
      icon: UsersRound,
      group: "Tata kelola",
    },
    {
      href: "/admin/monitoring",
      label: "Monitoring ujian",
      icon: Activity,
      group: "Tata kelola",
    },
    {
      href: "/teacher/results",
      label: "Hasil ujian",
      icon: GraduationCap,
      group: "Tata kelola",
    },
    {
      href: "/admin/audit",
      label: "Audit aktivitas",
      icon: ShieldCheck,
      group: "Tata kelola",
    },
    {
      href: "/principal/settings",
      label: "Pengaturan sekolah",
      icon: Settings2,
      group: "Tata kelola",
    },
  ],
  teacher: [
    {
      href: "/dashboard",
      label: "Ringkasan",
      icon: LayoutDashboard,
      group: "Workspace",
    },
    {
      href: "/teacher/questions",
      label: "Bank soal",
      icon: BookOpenCheck,
      group: "Pembelajaran",
    },
    {
      href: "/teacher/materials",
      label: "Materi",
      icon: BookOpenText,
      group: "Pembelajaran",
    },
    {
      href: "/teacher/assignments",
      label: "Tugas",
      icon: ClipboardList,
      group: "Pembelajaran",
    },
    {
      href: "/teacher/exams",
      label: "Ujian",
      icon: GraduationCap,
      group: "Pembelajaran",
    },
    {
      href: "/teacher/monitoring",
      label: "Monitoring",
      icon: Activity,
      group: "Evaluasi",
    },
    {
      href: "/teacher/results",
      label: "Hasil",
      icon: School,
      group: "Evaluasi",
    },
    {
      href: "/governance/requests",
      label: "Pengajuan jadwal",
      icon: ClipboardCheck,
      group: "Koordinasi sekolah",
    },
    {
      href: "/governance/actions",
      label: "Tindak lanjut saya",
      icon: ClipboardList,
      group: "Koordinasi sekolah",
    },
  ],
  student: [
    {
      href: "/dashboard",
      label: "Ringkasan",
      icon: LayoutDashboard,
      group: "Workspace",
    },
    {
      href: "/student/materials",
      label: "Materi",
      icon: BookOpenText,
      group: "Pembelajaran",
    },
    {
      href: "/student/assignments",
      label: "Tugas",
      icon: ClipboardList,
      group: "Pembelajaran",
    },
    {
      href: "/student/exams",
      label: "Ujian saya",
      icon: GraduationCap,
      group: "Pembelajaran",
    },
    {
      href: "/student/results",
      label: "Hasil belajar",
      icon: School,
      group: "Pembelajaran",
    },
  ],
};

export const roleLabels: Record<UserRole, string> = {
  superadmin: "Superadmin Sekolah",
  principal: "Kepala Sekolah",
  admin: "Administrator",
  teacher: "Guru",
  student: "Siswa",
};
