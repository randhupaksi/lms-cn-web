"use client";

import { useState } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import { useAcademicData } from "@/features/academics/use-academics";
import { useExams } from "@/features/exams/use-exams";
import {
  useExamResults,
  usePublishResults,
} from "@/features/results/use-results";

export default function TeacherResultsPage() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const [examId, setExamId] = useState("");
  const exams = useExams(courseId);
  const results = useExamResults(examId);
  const publish = usePublishResults(examId);
  return (
    <RoleBoundary allow={["teacher", "admin"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">GRADING & RESULTS</p>
          <h1 className="page-title">Hasil ujian</h1>
          <p className="page-description">
            Nilai objektif dihitung server secara deterministik. Siswa hanya
            dapat melihat hasil setelah dipublikasikan.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">
            Course
            <select
              className="field-input"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setExamId("");
              }}
            >
              <option value="">Pilih course</option>
              {academics.courses.data?.data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Ujian
            <select
              className="field-input"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
            >
              <option value="">Pilih ujian</option>
              {exams.data?.data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        {examId && (
          <section className="panel overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="section-title">Daftar nilai</h2>
                <p className="mt-1 text-xs text-muted">
                  {results.data?.meta.total ?? 0} hasil
                </p>
              </div>
              <button
                className="button-primary"
                disabled={publish.isPending || !results.data?.data.length}
                onClick={() => publish.mutate()}
              >
                Publikasikan hasil
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Siswa</th>
                    <th>Identitas</th>
                    <th>Nilai</th>
                    <th>Persentase</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.data?.data.map((item) => (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.student_name}</td>
                      <td>{item.identifier}</td>
                      <td>
                        {item.score} / {item.max_score}
                      </td>
                      <td>{item.percentage.toFixed(1)}%</td>
                      <td>
                        <span
                          className={`status-badge ${item.status === "published" ? "status-active" : ""}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!results.isLoading && results.data?.data.length === 0 && (
                    <tr>
                      <td className="empty-cell" colSpan={5}>
                        Belum ada hasil ujian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </RoleBoundary>
  );
}
