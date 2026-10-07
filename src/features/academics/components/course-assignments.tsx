"use client";
import { useState } from "react";
import { useAllCourses,useAssignCourseMembers,useCourseMembers } from "@/features/academics/use-academics";
import { useUsers } from "@/features/users";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { LoadingState } from "@/components/data-state";
const PAGE_SIZE=20;
export function CourseAssignments(){
 const courses=useAllCourses();const [courseId,setCourseId]=useState("");const members=useCourseMembers(courseId);const assignments=useAssignCourseMembers(courseId);
 const [teacherSearch,setTeacherSearch]=useState("");const [studentSearch,setStudentSearch]=useState("");const [teacherPage,setTeacherPage]=useState(1);const [studentPage,setStudentPage]=useState(1);
 const teachers=useUsers({role:"teacher",search:teacherSearch,page:teacherPage,per_page:PAGE_SIZE});
 const students=useUsers({role:"student",search:studentSearch,page:studentPage,per_page:PAGE_SIZE});
 const [teacherChanges,setTeacherChanges]=useState<string[]|null>(null);const [studentChanges,setStudentChanges]=useState<string[]|null>(null);
 const selectedTeachers=teacherChanges??members.data?.teachers.map((item)=>item.id)??[];
 const selectedStudents=studentChanges??members.data?.students.map((item)=>item.id)??[];
 return <section className="panel">
  <h2 className="section-title">Assignment course</h2><p className="mt-2 text-sm text-muted">Tetapkan guru pengelola dan siswa peserta sebelum membuat soal atau ujian.</p>
  <label className="field-label mt-5 max-w-lg">Course<RadixSelectField value={courseId} onValueChange={(value)=>{setCourseId(value);setTeacherChanges(null);setStudentChanges(null)}} placeholder="Pilih course" options={courses.data?.map((item)=>({value:item.id,label:item.name}))??[]}/></label>
  {courseId?<><div className="mt-6 grid gap-6 xl:grid-cols-2">
   <MemberSelector title="Guru pengelola" placeholder="Cari guru…" search={teacherSearch} onSearch={(v)=>{setTeacherSearch(v);setTeacherPage(1)}} users={teachers.data?.data??[]} selected={selectedTeachers} onChange={setTeacherChanges} page={teacherPage} totalPages={teachers.data?.meta.total_pages??1} onPageChange={setTeacherPage} loading={teachers.isLoading}/>
   <MemberSelector title="Siswa peserta" placeholder="Cari siswa…" search={studentSearch} onSearch={(v)=>{setStudentSearch(v);setStudentPage(1)}} users={students.data?.data??[]} selected={selectedStudents} onChange={setStudentChanges} page={studentPage} totalPages={students.data?.meta.total_pages??1} onPageChange={setStudentPage} loading={students.isLoading}/>
  </div>
  <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><Button disabled={assignments.teachers.isPending||selectedTeachers.length===0} onClick={()=>assignments.teachers.mutate(selectedTeachers)}>{assignments.teachers.isPending?"Menyimpan…":"Simpan guru"}</Button><AsyncFeedback error={assignments.teachers.error} isError={assignments.teachers.isError} isSuccess={assignments.teachers.isSuccess} errorMessage="Assignment guru belum dapat disimpan." successMessage="Guru pengelola berhasil diperbarui."/></div><div><Button disabled={assignments.students.isPending||selectedStudents.length===0} onClick={()=>assignments.students.mutate(selectedStudents)}>{assignments.students.isPending?"Menyimpan…":"Simpan siswa"}</Button><AsyncFeedback error={assignments.students.error} isError={assignments.students.isError} isSuccess={assignments.students.isSuccess} errorMessage="Assignment siswa belum dapat disimpan." successMessage="Daftar siswa berhasil diperbarui."/></div></div></>:null}
 </section>
}
type Member={id:string;full_name:string;identifier:string};
function MemberSelector({title,placeholder,search,onSearch,users,selected,onChange,page,totalPages,onPageChange,loading}:{title:string;placeholder:string;search:string;onSearch:(value:string)=>void;users:Member[];selected:string[];onChange:(ids:string[])=>void;page:number;totalPages:number;onPageChange:(page:number)=>void;loading:boolean}){
 return <div><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">{title}</h3><span className="text-xs text-muted">{selected.length} dipilih</span></div><input className="field-input mt-3" type="search" placeholder={placeholder} value={search} onChange={(e)=>onSearch(e.target.value)}/><div className="mt-3 max-h-72 space-y-2 overflow-y-auto">{loading?<LoadingState label="Memuat daftar pengguna…"/>:null}{users.map((user)=><label className="selection-item flex items-center gap-3 p-3 text-sm" key={user.id}><input type="checkbox" checked={selected.includes(user.id)} onChange={(e)=>onChange(e.target.checked?[...selected,user.id]:selected.filter((id)=>id!==user.id))}/><span><span className="block font-semibold">{user.full_name}</span><span className="text-xs text-muted">{user.identifier}</span></span></label>)}</div><Pagination page={page} totalPages={totalPages} onPageChange={onPageChange}/></div>
}
