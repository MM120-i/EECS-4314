import SideNav from "@/app/componets/dashboard/sidenav";

export default function Layout({children }: {children: React.ReactNode}){
     return (
        <div className="flex relative min-h-screen flex-col md:flex-row md:overflow-hidden">
        <SideNav/>
        <div className="p-2 md:p-10 text-2xl font-bold flex-1">
            {children}
        </div>
    </div>
    )
}