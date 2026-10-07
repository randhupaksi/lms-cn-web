"use client";
import { useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { AsyncFeedback } from "@/components/async-feedback";
import { EmptyState,ErrorState,LoadingState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { RoleBoundary } from "@/components/role-boundary";
import { Button } from "@/components/ui/button";
import { DataTable,DataTableShell } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { RadixSelectField } from "@/components/ui/radix-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useAllCourses } from "@/features/academics/use-academics";
import { useExamAnalytics } from "@/features/analytics";
import { useExams } from "@/features/exams";
import { usePublishResults,useResults } from "@/features/results/use-results";
import { exportExamResults } from "@/services/results.service";
const PAGE_SIZE=20;
const resultStatus={draft:{label:"Draft",tone:"neutral" as const},reviewed:{label:"Sudah ditinjau",tone:"warning" as const},published:{label:"Dipublikasikan",tone:"success" as const}};
export function TeacherResultsWorkspace(){
 const courses=useAllCourses();const [courseFilter,setCourseFilter]=useState("all");const [examFilter,setExamFilter]=useState("all");const [search,setSearch]=useState("");const [page,setPage]=useState(1);
 const selectedCourse=courseFilter==="all"?undefined:courseFilter;const selectedExam=examFilter==="all"?undefined:examFilter;
 const exams=useExams(selectedCourse,{page:1,per_page:100});
 const results=useResults({course_id:selectedCourse,exam_id:selectedExam,search,page,per_page:PAGE_SIZE});
 const analytics=useExamAnalytics(selectedExam??"");const publish=usePublishResults(selectedExam??"");
 const [exportState,setExportState]=useState<{error:unknown;isError:boolean;isSuccess:boolean;isPending:boolean}>({error:null,isError:false,isSuccess:false,isPending:false});
 async function downloadExport(){if(!selectedExam)return;setExportState({error:null,isError:false,isSuccess:false,isPending:true});try{const blob=await exportExamResults(selectedExam);const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download="hasil-ujian.csv";anchor.click();URL.revokeObjectURL(url);setExportState({error:null,isError:false,isSuccess:true,isPending:false})}catch(error){setExportState({error,isError:true,isSuccess:false,isPending:false})}}
 const courseOptions=courses.data?.map((item)=>({value:item.id,label:item.name}))??[];
 const examOptions=(exams.data?.data??[]).map((item)=>({value:item.id,label:item.title}));
 return <RoleBoundary allow={["teacher","admin"]}><div className="space-y-8">
  <PageHeader eyebrow="Penilaian dan hasil" title="Hasil ujian" description="Nilai objektif dihitung server secara deterministik. Siswa hanya dapat melihat hasil setelah dipublikasikan." icon={ChartNoAxesCombined}/>
  <section className="space-y-4">
   <div className="grid gap-3 md:grid-cols-3">
    <label className="field-label">Cari siswa atau ujian<input className="field-input" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder="Nama, identitas, atau judul ujian"/></label>
    <label className="field-label">Course<RadixSelectField value={courseFilter} onValueChange={(v)=>{setCourseFilter(v);setExamFilter("all");setPage(1)}} placeholder="Semua course" options={[{value:"all",label:"Semua course"},...courseOptions]}/></label>
    <label className="field-label">Ujian<RadixSelectField value={examFilter} onValueChange={(v)=>{setExamFilter(v);setPage(1)}} placeholder="Semua ujian" options={[{value:"all",label:"Semua ujian"},...examOptions]}/></label>
   </div>
   {exams.isLoading?<LoadingState label="Memuat pilihan ujian…"/>:null}
   {results.isLoading?<LoadingState label="Memuat hasil ujian…"/>:null}
   {results.isError?<ErrorState label="Hasil ujian belum dapat dimuat." onRetry={()=>void results.refetch()}/>:null}
   {results.data&&results.data.data.length===0?<EmptyState title="Belum ada hasil" description="Belum ada hasil yang sesuai dengan filter ini."/>:null}
   {results.data?<DataTableShell>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><div><h2 className="section-title">Daftar nilai</h2><p className="mt-1 text-xs text-muted">{results.data.meta.total} hasil</p></div><div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={()=>void downloadExport()} disabled={!selectedExam||exportState.isPending||!results.data.data.length}>{exportState.isPending?"Menyiapkan…":"Export CSV ujian terpilih"}</Button><Button disabled={!selectedExam||publish.isPending||!results.data.data.length} onClick={()=>publish.mutate()}>{publish.isPending?"Mempublikasikan…":"Publikasikan hasil ujian terpilih"}</Button></div></div>
    <AsyncFeedback error={publish.error} isError={publish.isError} isSuccess={publish.isSuccess} errorMessage="Hasil belum dapat dipublikasikan." successMessage="Hasil berhasil dipublikasikan kepada siswa."/>
    <AsyncFeedback error={exportState.error} isError={exportState.isError} isSuccess={exportState.isSuccess} errorMessage="File hasil belum dapat diunduh." successMessage="File hasil berhasil disiapkan."/>
    <div className="overflow-x-auto"><DataTable><thead><tr><th>Ujian</th><th>Siswa</th><th>Identitas</th><th>Nilai</th><th>Persentase</th><th>Status</th></tr></thead><tbody>{results.data.data.map((item)=>{const state=resultStatus[item.status as keyof typeof resultStatus]??{label:item.status,tone:"neutral" as const};return <tr key={item.id}><td>{item.exam_title}<span className="block text-xs text-muted">{item.course_name??courses.data?.find((c)=>c.id===item.course_id)?.name}</span></td><td className="font-semibold">{item.student_name}</td><td>{item.identifier}</td><td>{item.score} / {item.max_score}</td><td>{item.percentage.toFixed(1)}%</td><td><StatusBadge tone={state.tone}>{state.label}</StatusBadge></td></tr>})}</tbody></DataTable></div>
    <Pagination page={page} totalPages={results.data.meta.total_pages} onPageChange={setPage}/>
   </DataTableShell>:null}
  </section>
  {selectedExam?<div className="space-y-6">
   {analytics.isLoading?<LoadingState label="Menghitung analisis ujian…"/>:null}
   {analytics.isError?<ErrorState label="Analisis ujian belum dapat dimuat." onRetry={()=>void analytics.refetch()}/>:null}
   {analytics.data?<MetricGrid metrics={[{key:"participants",label:"Peserta",value:analytics.data.participant_count},{key:"submitted",label:"Dikumpulkan",value:analytics.data.submitted_count},{key:"average",label:"Rata-rata",value:Number(analytics.data.average_score.toFixed(2))},{key:"average_percent",label:"Rata-rata (%)",value:Number(analytics.data.average_percent.toFixed(2))}]}/>:null}
   {analytics.data&&analytics.data.items.length>0?<DataTableShell><div className="border-b border-border p-5"><h2 className="section-title">Analisis butir soal</h2><p className="mt-1 text-xs text-muted">Akurasi dihitung dari jawaban attempt yang tersimpan.</p></div><div className="overflow-x-auto"><DataTable><thead><tr><th>Soal</th><th>Dijawab</th><th>Benar</th><th>Akurasi</th></tr></thead><tbody>{analytics.data.items.map((item)=><tr key={item.question_id}><td className="max-w-xl whitespace-normal font-semibold">{item.stem}</td><td>{item.answered_count}</td><td>{item.correct_count}</td><td>{item.accuracy.toFixed(1)}%</td></tr>)}</tbody></DataTable></div></DataTableShell>:null}
  </div>:null}
 </div></RoleBoundary>
}
