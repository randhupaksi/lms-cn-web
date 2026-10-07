"use client";
import { useState } from "react";
import { BookOpenText,CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState,ErrorState,LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics/use-academics";
import { useCompleteMaterial,useMaterials } from "@/features/materials/use-materials";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
const PAGE_SIZE=20;
export function StudentMaterialsWorkspace(){
 const courses=useAllCourses(); const [courseFilter,setCourseFilter]=useState("all"); const [search,setSearch]=useState(""); const [page,setPage]=useState(1);
 const materials=useMaterials(courseFilter==="all"?undefined:courseFilter,{search,status:"published",page,per_page:PAGE_SIZE});
 const complete=useCompleteMaterial();
 const courseOptions=courses.data?.map((item)=>({value:item.id,label:item.name}))??[];
 return <RoleBoundary allow={["student"]}><div className="space-y-8">
  <PageHeader eyebrow="Course saya" title="Materi pembelajaran" description="Pelajari materi yang telah dipublikasikan dan tandai ketika selesai." icon={BookOpenText}/>
  <div className="grid gap-3 sm:grid-cols-2"><label className="field-label">Cari materi<input className="field-input" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder="Judul atau deskripsi"/></label><label className="field-label">Course<RadixSelectField value={courseFilter} onValueChange={(v)=>{setCourseFilter(v);setPage(1)}} placeholder="Semua course" options={[{value:"all",label:"Semua course"},...courseOptions]}/></label></div>
  {materials.isLoading?<LoadingState label="Memuat materi…"/>:null}
  {materials.isError?<ErrorState label="Materi belum dapat dimuat." onRetry={()=>void materials.refetch()}/>:null}
  {!materials.isLoading&&!materials.isError&&materials.data?.data.length===0?<EmptyState title="Belum ada materi" description="Belum ada materi yang sesuai dengan filter ini."/>:null}
  {materials.data?.data.map((material)=><article className="panel panel-interactive" key={material.id}>
   <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold text-muted">MATERI {material.position} · {material.course_name??courses.data?.find((c)=>c.id===material.course_id)?.name}</p><h2 className="mt-2 text-lg font-semibold">{material.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{material.description}</p></div>{material.completed_at?<StatusBadge tone="success"><CheckCircle2 aria-hidden="true" size={14}/> Selesai</StatusBadge>:null}</div>
   <div className="mt-5 whitespace-pre-wrap text-sm leading-7">{material.content}</div>
   {!material.completed_at?<div><Button className="mt-5" onClick={()=>complete.mutate(material.id)} disabled={complete.isPending}>{complete.isPending&&complete.variables===material.id?"Menyimpan…":"Tandai selesai"}</Button>{complete.variables===material.id?<AsyncFeedback error={complete.error} isError={complete.isError} isSuccess={false} errorMessage="Progres materi belum dapat disimpan." successMessage=""/>:null}</div>:null}
  </article>)}
  {materials.data?<Pagination page={page} totalPages={materials.data.meta.total_pages} onPageChange={setPage}/>:null}
 </div></RoleBoundary>
}
