"use client";
import { useState,type FormEvent } from "react";
import { EmptyState,ErrorState,LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics/use-academics";
import { useAssignments,useGradeSubmission,usePublishAssignment,useSaveAssignment,useSubmissions } from "@/features/assignments/use-assignments";
import type { Assignment,AssignmentSubmission } from "@/types/lms";
import { PageHeader } from "@/components/ui/page-header";
import { ClipboardList } from "lucide-react";
import { DataTable,DataTableShell } from "@/components/ui/data-table";
import { RadixSelectField } from "@/components/ui/radix-select";
import { DateTimePickerField } from "@/components/ui/date-picker";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
const PAGE_SIZE=20; const emptyForm={title:"",instructions:"",due_at:"",max_score:100};
export function TeacherAssignmentsWorkspace(){
 const courses=useAllCourses(); const [courseFilter,setCourseFilter]=useState("all"); const [targetCourseId,setTargetCourseId]=useState(""); const [search,setSearch]=useState(""); const [status,setStatus]=useState("all"); const [page,setPage]=useState(1);
 const [assignmentId,setAssignmentId]=useState(""); const [selectedAssignment,setSelectedAssignment]=useState<Assignment|null>(null); const [submissionSearch,setSubmissionSearch]=useState(""); const [submissionPage,setSubmissionPage]=useState(1); const [form,setForm]=useState(emptyForm);
 const assignments=useAssignments(courseFilter==="all"?undefined:courseFilter,{search,status:status==="all"?undefined:status,page,per_page:PAGE_SIZE});
 const save=useSaveAssignment(); const publish=usePublishAssignment();
 const submissions=useSubmissions(assignmentId,{search:submissionSearch,page:submissionPage,per_page:PAGE_SIZE}); const grade=useGradeSubmission(assignmentId);
 function submit(event:FormEvent){event.preventDefault();if(!targetCourseId)return;save.mutate({input:{...form,course_id:targetCourseId,due_at:new Date(form.due_at).toISOString()}},{onSuccess:()=>setForm(emptyForm)})}
 const courseOptions=courses.data?.map((item)=>({value:item.id,label:item.name}))??[];
 return <RoleBoundary allow={["teacher"]}><div className="space-y-8">
  <PageHeader eyebrow="Course assessment" title="Tugas" description="Kelola tugas non-ujian, pengumpulan siswa, feedback, dan nilai dalam scope course." icon={ClipboardList}/>
  <section className="panel"><h2 className="section-title">Buat tugas</h2><form className="form-grid mt-4" onSubmit={submit}>
   <label className="field-label md:col-span-2">Course untuk tugas<RadixSelectField value={targetCourseId} onValueChange={setTargetCourseId} placeholder="Pilih course" options={courseOptions}/></label>
   <label className="field-label md:col-span-2">Judul<input className="field-input" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Contoh: Esai refleksi Bab 1" required/></label>
   <label className="field-label md:col-span-2">Instruksi<textarea className="field-input min-h-32" value={form.instructions} onChange={(e)=>setForm({...form,instructions:e.target.value})} placeholder="Jelaskan tugas, kriteria, dan berkas yang perlu dikumpulkan…" required/></label>
   <label className="field-label">Batas pengumpulan<DateTimePickerField value={form.due_at} onChange={(value)=>setForm({...form,due_at:value})} required/></label>
   <label className="field-label">Skor maksimal<input className="field-input" type="number" min={1} value={form.max_score} onChange={(e)=>setForm({...form,max_score:Number(e.target.value)})} required/></label>
   <Button type="submit" className="md:col-span-2" disabled={save.isPending||!targetCourseId||!form.due_at}>{save.isPending?"Menyimpan…":"Simpan draft"}</Button>
   <div className="md:col-span-2"><AsyncFeedback error={save.error} isError={save.isError} isSuccess={save.isSuccess} errorMessage="Tugas belum dapat disimpan. Periksa data dan jadwal pengumpulan." successMessage="Draft tugas berhasil disimpan."/></div>
  </form></section>
  <section className="space-y-4">
   <div className="grid gap-3 sm:grid-cols-3">
    <label className="field-label">Cari tugas<input className="field-input" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);setAssignmentId("");setSelectedAssignment(null)}} placeholder="Judul atau instruksi"/></label>
    <label className="field-label">Course<RadixSelectField value={courseFilter} onValueChange={(v)=>{setCourseFilter(v);setPage(1);setAssignmentId("");setSelectedAssignment(null)}} placeholder="Semua course" options={[{value:"all",label:"Semua course"},...courseOptions]}/></label>
    <label className="field-label">Status<RadixSelectField value={status} onValueChange={(v)=>{setStatus(v);setPage(1)}} placeholder="Semua status" options={[{value:"all",label:"Semua status"},{value:"draft",label:"Draft"},{value:"published",label:"Dipublikasikan"},{value:"closed",label:"Ditutup"}]}/></label>
   </div>
   <h2 className="section-title">Daftar tugas ({assignments.data?.meta.total??0})</h2>
   {assignments.isLoading?<LoadingState label="Memuat tugas…"/>:null}
   {assignments.isError?<ErrorState label="Tugas belum dapat dimuat." onRetry={()=>void assignments.refetch()}/>:null}
   {!assignments.isLoading&&!assignments.isError&&assignments.data?.data.length===0?<EmptyState title="Belum ada tugas" description="Belum ada tugas yang sesuai dengan filter ini."/>:null}
   <div className="grid gap-4 md:grid-cols-2">{assignments.data?.data.map((assignment)=><article className="panel panel-interactive" key={assignment.id}>
    <div className="flex items-start justify-between gap-4"><div><span className={"status-badge "+(assignment.status==="published"?"status-active":"")}>{assignment.status}</span><h2 className="mt-3 text-lg font-semibold">{assignment.title}</h2><p className="mt-1 text-xs text-muted">{assignment.course_name??courses.data?.find((c)=>c.id===assignment.course_id)?.name}</p></div><span className="text-sm font-semibold">{assignment.max_score} poin</span></div>
    <p className="mt-3 text-sm leading-6 text-muted">Deadline {new Date(assignment.due_at).toLocaleString("id-ID")}</p>
    <div className="mt-4 flex flex-wrap gap-2">{assignment.status==="draft"?<Button onClick={()=>publish.mutate(assignment.id)}>Publikasikan</Button>:null}<Button variant="ghost" onClick={()=>{setAssignmentId(assignment.id);setSelectedAssignment(assignment);setSubmissionPage(1);setSubmissionSearch("")}}>Lihat pengumpulan</Button></div>
   </article>)}</div>
   {assignments.data?<Pagination page={page} totalPages={assignments.data.meta.total_pages} onPageChange={setPage}/>:null}
   <AsyncFeedback error={publish.error} isError={publish.isError} isSuccess={publish.isSuccess} errorMessage="Tugas belum dapat dipublikasikan." successMessage="Tugas berhasil dipublikasikan."/>
  </section>
  {assignmentId?<DataTableShell>
   <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border p-5"><div><h2 className="section-title">Pengumpulan siswa · {selectedAssignment?.title}</h2><p className="mt-1 text-xs text-muted">{submissions.data?.meta.total??0} pengumpulan</p></div><label className="field-label">Cari siswa<input className="field-input" type="search" value={submissionSearch} onChange={(e)=>{setSubmissionSearch(e.target.value);setSubmissionPage(1)}} placeholder="Nama atau identifier"/></label></div>
   {submissions.isLoading?<div className="p-5"><LoadingState/></div>:null}
   {!submissions.isLoading&&submissions.data?.data.length===0?<div className="p-5"><EmptyState title="Belum ada pengumpulan" description="Tidak ada pengumpulan yang sesuai dengan pencarian."/></div>:null}
   <div className="overflow-x-auto"><DataTable><thead><tr><th>Siswa</th><th>Jawaban</th><th>Nilai</th><th>Feedback</th><th>Aksi</th></tr></thead><tbody>{submissions.data?.data.map((item)=><SubmissionRow key={item.id} submission={item} maxScore={selectedAssignment?.max_score??100} onGrade={(score,feedback)=>grade.mutate({id:item.id,input:{score,feedback}})}/>)}</tbody></DataTable></div>
   {submissions.data?<Pagination page={submissionPage} totalPages={submissions.data.meta.total_pages} onPageChange={setSubmissionPage}/>:null}
  </DataTableShell>:null}
 </div></RoleBoundary>
}
function SubmissionRow({submission,maxScore,onGrade}:{submission:AssignmentSubmission;maxScore:number;onGrade:(score:number,feedback:string)=>void}){
 const [score,setScore]=useState(submission.score??0);const [feedback,setFeedback]=useState(submission.feedback);
 return <tr><td className="font-semibold">{submission.student_name}</td><td className="max-w-sm whitespace-normal">{submission.content}</td><td><input aria-label="Nilai" className="field-input w-24" type="number" min={0} max={maxScore} value={score} onChange={(e)=>setScore(Number(e.target.value))}/></td><td><input aria-label="Feedback" className="field-input min-w-56" value={feedback} onChange={(e)=>setFeedback(e.target.value)} placeholder="Tulis feedback untuk siswa…"/></td><td><Button onClick={()=>onGrade(score,feedback)}>Simpan nilai</Button></td></tr>
}
