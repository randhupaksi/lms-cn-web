"use client";
import { useState,type FormEvent } from "react";
import { EmptyState,ErrorState,LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics/use-academics";
import { useMaterials,usePublishMaterial,useSaveMaterial } from "@/features/materials/use-materials";
import type { CourseMaterial } from "@/types/lms";
import { PageHeader } from "@/components/ui/page-header";
import { BookOpenText } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
const PAGE_SIZE=20;
const emptyForm={title:"",description:"",content:"",position:1};
export function TeacherMaterialsWorkspace(){
 const courses=useAllCourses(); const [courseFilter,setCourseFilter]=useState("all"); const [targetCourseId,setTargetCourseId]=useState("");
 const [search,setSearch]=useState(""); const [status,setStatus]=useState("all"); const [page,setPage]=useState(1);
 const [editingId,setEditingId]=useState<string>(); const [form,setForm]=useState(emptyForm);
 const materials=useMaterials(courseFilter==="all"?undefined:courseFilter,{search,status:status==="all"?undefined:status,page,per_page:PAGE_SIZE});
 const save=useSaveMaterial(); const publish=usePublishMaterial();
 function edit(item:CourseMaterial){setEditingId(item.id);setTargetCourseId(item.course_id);setForm({title:item.title,description:item.description,content:item.content,position:item.position})}
 function reset(){setEditingId(undefined);setForm(emptyForm)}
 function submit(event:FormEvent){event.preventDefault();if(!targetCourseId)return;save.mutate({id:editingId,input:{...form,course_id:targetCourseId}},{onSuccess:reset})}
 const courseOptions=courses.data?.map((item)=>({value:item.id,label:item.name}))??[];
 return <RoleBoundary allow={["teacher"]}><div className="space-y-8">
  <PageHeader eyebrow="Course content" title="Materi pembelajaran" description="Susun materi sebagai draft, lalu publikasikan ketika kontennya siap dipelajari siswa." icon={BookOpenText}/>
  <section className="panel"><div className="flex items-center justify-between"><h2 className="section-title">{editingId?"Perbarui materi":"Buat materi"}</h2>{editingId?<Button variant="ghost" onClick={reset}>Batal</Button>:null}</div>
   <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submit}>
    <label className="field-label md:col-span-2">Course untuk materi<RadixSelectField value={targetCourseId} onValueChange={setTargetCourseId} placeholder="Pilih course" options={courseOptions}/></label>
    <label className="field-label md:col-span-2">Judul<input className="field-input" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Contoh: Persamaan Kuadrat" required/></label>
    <label className="field-label md:col-span-2">Ringkasan<textarea className="field-input min-h-20" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Ringkasan singkat materi untuk siswa…"/></label>
    <label className="field-label md:col-span-2">Konten<textarea className="field-input min-h-48" value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})} placeholder="Tulis materi pembelajaran, contoh, dan penjelasan utama…" required/></label>
    <label className="field-label max-w-32">Urutan<input className="field-input" type="number" min={1} value={form.position} onChange={(e)=>setForm({...form,position:Number(e.target.value)})}/></label>
    <div className="self-end"><Button type="submit" disabled={save.isPending||!targetCourseId}>{save.isPending?"Menyimpan…":"Simpan draft"}</Button></div>
    <div className="md:col-span-2"><AsyncFeedback error={save.error} isError={save.isError} isSuccess={save.isSuccess} errorMessage="Materi belum dapat disimpan." successMessage="Draft materi berhasil disimpan."/></div>
   </form>
  </section>
  <section className="space-y-4">
   <div className="grid gap-3 sm:grid-cols-3">
    <label className="field-label">Cari materi<input className="field-input" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder="Judul atau deskripsi"/></label>
    <label className="field-label">Course<RadixSelectField value={courseFilter} onValueChange={(v)=>{setCourseFilter(v);setPage(1)}} placeholder="Semua course" options={[{value:"all",label:"Semua course"},...courseOptions]}/></label>
    <label className="field-label">Status<RadixSelectField value={status} onValueChange={(v)=>{setStatus(v);setPage(1)}} placeholder="Semua status" options={[{value:"all",label:"Semua status"},{value:"draft",label:"Draft"},{value:"published",label:"Dipublikasikan"}]}/></label>
   </div>
   {materials.isLoading?<LoadingState label="Memuat materi…"/>:null}
   {materials.isError?<ErrorState label="Materi belum dapat dimuat." onRetry={()=>void materials.refetch()}/>:null}
   {!materials.isLoading&&!materials.isError&&materials.data?.data.length===0?<EmptyState title="Belum ada materi" description="Belum ada materi yang sesuai dengan filter ini."/>:null}
   {materials.data?.data.map((item)=><article className="panel panel-interactive" key={item.id}>
    <div className="flex items-start justify-between gap-4"><div><span className={"status-badge "+(item.status==="published"?"status-active":"")}>{item.status}</span><h2 className="mt-3 text-lg font-semibold">{item.position}. {item.title}</h2><p className="mt-1 text-xs text-muted">{item.course_name??courses.data?.find((c)=>c.id===item.course_id)?.name}</p><p className="mt-2 text-sm leading-6 text-muted">{item.description}</p></div></div>
    <div className="mt-4 flex gap-2"><Button variant="ghost" onClick={()=>edit(item)} disabled={item.status!=="draft"}>Edit</Button>{item.status==="draft"?<Button onClick={()=>publish.mutate(item.id)} disabled={publish.isPending}>Publikasikan</Button>:null}</div>
   </article>)}
   {materials.data?<Pagination page={page} totalPages={materials.data.meta.total_pages} onPageChange={setPage}/>:null}
   <AsyncFeedback error={publish.error} isError={publish.isError} isSuccess={publish.isSuccess} errorMessage="Materi belum dapat dipublikasikan." successMessage="Materi berhasil dipublikasikan."/>
  </section>
 </div></RoleBoundary>
}
