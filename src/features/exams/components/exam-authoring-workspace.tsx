"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics/use-academics";
import { useCreateExam, useExamAction, useExams } from "@/features/exams/use-exams";
import { publishExam, unpublishExam } from "@/services/exams.service";
import { PageHeader } from "@/components/ui/page-header";
import { GraduationCap } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { DateTimePickerField } from "@/components/ui/date-picker";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE=20;
const emptyForm={title:"",description:"",starts_at:"",ends_at:"",duration_minutes:90,allow_back_navigation:true,randomize_questions:false,randomize_options:false};

export function ExamAuthoringWorkspace() {
  const courses=useAllCourses();
  const [courseFilter,setCourseFilter]=useState("all");
  const [targetCourseId,setTargetCourseId]=useState("");
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("all");
  const [page,setPage]=useState(1);
  const [form,setForm]=useState(emptyForm);
  const selectedCourse=courseFilter==="all"?undefined:courseFilter;
  const filterStatus=status==="all"?undefined:status;
  const exams=useExams(selectedCourse,{search,status:filterStatus,page,per_page:PAGE_SIZE});
  const create=useCreateExam();
  const publish=useExamAction(publishExam);
  const unpublish=useExamAction(unpublishExam);
  function submit(event:FormEvent){
    event.preventDefault(); if(!targetCourseId)return;
    create.mutate({...form,course_id:targetCourseId,starts_at:new Date(form.starts_at).toISOString(),ends_at:new Date(form.ends_at).toISOString()},{onSuccess:()=>setForm(emptyForm)});
  }
  const scheduleInvalid=Boolean(form.starts_at&&form.ends_at)&&new Date(form.ends_at).getTime()<=new Date(form.starts_at).getTime();
  const courseOptions=courses.data?.map((item)=>({value:item.id,label:item.name}))??[];
  return <RoleBoundary allow={["teacher"]}>
    <div className="space-y-8">
      <PageHeader eyebrow="Exam authoring" title="Ujian" description="Siapkan jadwal dan durasi dalam status draft. Soal dan peserta harus ditetapkan sebelum ujian dipublikasikan." icon={GraduationCap}/>
      <section className="panel">
        <h2 className="section-title">Buat ujian</h2>
        <form className="form-grid" onSubmit={submit}>
          <label className="field-label md:col-span-2">Course
            <RadixSelectField value={targetCourseId} onValueChange={setTargetCourseId} placeholder="Pilih course untuk ujian" options={courseOptions}/>
          </label>
          <label className="field-label md:col-span-2">Judul<input className="field-input" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Contoh: Ujian Akhir Semester Matematika" required/></label>
          <label className="field-label md:col-span-2">Deskripsi<textarea className="field-input min-h-24" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Jelaskan cakupan materi dan instruksi ujian…"/></label>
          <label className="field-label">Mulai<DateTimePickerField value={form.starts_at} onChange={(value)=>setForm({...form,starts_at:value})} required/></label>
          <label className="field-label">Selesai<DateTimePickerField value={form.ends_at} onChange={(value)=>setForm({...form,ends_at:value})} required/></label>
          <label className="field-label">Durasi (menit)<input className="field-input" type="number" min={1} value={form.duration_minutes} onChange={(e)=>setForm({...form,duration_minutes:Number(e.target.value)})} required/></label>
          <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold"><input type="checkbox" checked={form.allow_back_navigation} onChange={(e)=>setForm({...form,allow_back_navigation:e.target.checked})}/> Izinkan kembali ke soal sebelumnya</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.randomize_questions} onChange={(e)=>setForm({...form,randomize_questions:e.target.checked})}/> Acak urutan soal per attempt</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.randomize_options} onChange={(e)=>setForm({...form,randomize_options:e.target.checked})}/> Acak opsi jawaban per attempt</label>
          <Button type="submit" className="md:col-span-2" disabled={create.isPending||!targetCourseId||!form.starts_at||!form.ends_at||scheduleInvalid}>{create.isPending?"Menyimpan…":"Simpan draft"}</Button>
          {scheduleInvalid?<p className="form-error md:col-span-2" role="alert">Waktu selesai harus setelah waktu mulai.</p>:null}
          <div className="md:col-span-2"><AsyncFeedback error={create.error} isError={create.isError} isSuccess={create.isSuccess} errorMessage="Draft ujian belum dapat disimpan." successMessage="Draft ujian berhasil disimpan. Lanjutkan dengan menetapkan soal dan peserta."/></div>
        </form>
      </section>
      <section className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="field-label">Cari ujian<input className="field-input" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder="Judul ujian"/></label>
          <label className="field-label">Course<RadixSelectField value={courseFilter} onValueChange={(value)=>{setCourseFilter(value);setPage(1)}} placeholder="Semua course" options={[{value:"all",label:"Semua course"},...courseOptions]}/></label>
          <label className="field-label">Status<RadixSelectField value={status} onValueChange={(value)=>{setStatus(value);setPage(1)}} placeholder="Semua status" options={[{value:"all",label:"Semua status"},{value:"draft",label:"Draft"},{value:"published",label:"Dipublikasikan"}]}/></label>
        </div>
        <h2 className="section-title">Daftar ujian ({exams.data?.meta.total??0})</h2>
        {courses.isError?<ErrorState label="Course belum dapat dimuat." onRetry={()=>void courses.refetch()}/>:null}
        {exams.isLoading?<LoadingState label="Memuat ujian…"/>:null}
        {exams.isError?<ErrorState label="Ujian belum dapat dimuat." onRetry={()=>void exams.refetch()}/>:null}
        {!exams.isLoading&&!exams.isError&&exams.data?.data.length===0?<EmptyState title="Belum ada ujian" description="Belum ada ujian yang sesuai dengan filter ini."/>:null}
        <div className="grid gap-4 md:grid-cols-2">
          {exams.data?.data.map((exam)=><article className="panel panel-interactive" key={exam.id}>
            <div className="flex items-start justify-between gap-4"><div><span className={"status-badge "+(exam.status==="published"?"status-active":"")}>{exam.status}</span><h2 className="mt-3 text-lg font-semibold">{exam.title}</h2><p className="mt-1 text-sm text-muted">{exam.course_name??courses.data?.find((item)=>item.id===exam.course_id)?.name}</p></div><span className="text-sm font-semibold">{exam.total_points} poin</span></div>
            <p className="mt-3 text-sm text-muted">{new Date(exam.starts_at).toLocaleString("id-ID")} – {new Date(exam.ends_at).toLocaleString("id-ID")}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted">Durasi</dt><dd className="font-semibold">{exam.duration_minutes} menit</dd></div><div><dt className="text-muted">Soal</dt><dd className="font-semibold">{exam.question_count}</dd></div></dl>
            <div className="mt-5 flex flex-wrap gap-2"><Link className="button-ghost" href={`/teacher/exams/${exam.id}`}>Atur ujian</Link>{exam.status==="draft"?<Button onClick={()=>publish.mutate(exam.id)}>Publikasikan</Button>:exam.status==="published"?<Button variant="ghost" onClick={()=>unpublish.mutate(exam.id)}>Batalkan publikasi</Button>:null}</div>
          </article>)}
        </div>
        {exams.data?<Pagination page={page} totalPages={exams.data.meta.total_pages} onPageChange={setPage}/>:null}
        <AsyncFeedback error={publish.error} isError={publish.isError} isSuccess={publish.isSuccess} errorMessage="Ujian belum dapat dipublikasikan. Pastikan soal dan peserta sudah lengkap." successMessage="Ujian berhasil dipublikasikan."/>
        <AsyncFeedback error={unpublish.error} isError={unpublish.isError} isSuccess={unpublish.isSuccess} errorMessage="Publikasi ujian belum dapat dibatalkan." successMessage="Publikasi ujian berhasil dibatalkan."/>
      </section>
    </div>
  </RoleBoundary>;
}
