"use client";
import { useState } from "react";
import { DataTable,DataTableShell } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState,ErrorState,LoadingState } from "@/components/data-state";
import { useCourses } from "@/features/academics/use-academics";
const PAGE_SIZE=20;
export function CourseTable(){
 const [search,setSearch]=useState("");const [page,setPage]=useState(1);
 const courses=useCourses({search,page,per_page:PAGE_SIZE});
 return <DataTableShell>
  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border p-5"><div><h2 className="section-title">Course aktif</h2><p className="mt-1 text-xs text-muted">{courses.data?.meta.total??0} course</p></div><label className="field-label">Cari course<input className="field-input" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder="Nama course, kelas, atau mata pelajaran"/></label></div>
  {courses.isLoading?<div className="p-5"><LoadingState label="Memuat course…"/></div>:null}
  {courses.isError?<div className="p-5"><ErrorState label="Daftar course belum dapat dimuat." onRetry={()=>void courses.refetch()}/></div>:null}
  {!courses.isLoading&&!courses.isError&&courses.data?.data.length===0?<div className="p-5"><EmptyState title="Belum ada course" description="Belum ada course yang sesuai dengan pencarian."/></div>:null}
  <div className="overflow-x-auto"><DataTable><thead><tr><th>Course</th><th>Mata pelajaran</th><th>Kelas</th><th>Tahun ajaran</th></tr></thead><tbody>{courses.data?.data.map((item)=><tr key={item.id}><td className="font-semibold">{item.name}</td><td>{item.subject.name}</td><td>{item.class_group.name}</td><td>{item.academic_year.name}</td></tr>)}</tbody></DataTable></div>
  {courses.data?<Pagination page={page} totalPages={courses.data.meta.total_pages} onPageChange={setPage}/>:null}
 </DataTableShell>
}
