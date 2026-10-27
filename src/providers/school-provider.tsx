"use client";
import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getSchoolProfile,
  type SchoolProfile,
} from "@/services/school.service";
const fallback: SchoolProfile = {
  school_name: "Citra Negara",
  motto: "Belajar, bertumbuh, berkarya.",
  contact_email: "",
  support_message: "Hubungi administrator sekolah untuk bantuan akses.",
};
const SchoolContext = createContext(fallback);
export function SchoolProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["school-profile"],
    queryFn: getSchoolProfile,
  });
  return (
    <SchoolContext.Provider value={query.data ?? fallback}>
      {children}
    </SchoolContext.Provider>
  );
}
export const useSchoolProfile = () => useContext(SchoolContext);
