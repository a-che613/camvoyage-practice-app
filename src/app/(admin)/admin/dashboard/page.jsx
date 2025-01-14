"use client"

import dynamic from "next/dynamic";



const ClientOnlyAdminDashboard= dynamic(
  () => import("@/components/admin/dashboard/dashboard"),
  {
    ssr: false,
  }
);

const NewDashboard = () => {
  return <ClientOnlyAdminDashboard />
}

export default NewDashboard;