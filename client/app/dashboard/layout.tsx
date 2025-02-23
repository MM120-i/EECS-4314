import SideNav from "@/app/componets/dashboard/sidenav";

export default function Layout({children }: {children: React.ReactNode}){
     return (
        <div className="relative min-h-screen flex">
            <SideNav/>
            <div className="p-10 text-2xl font-bold flex-1">
                {children}
            </div>
        </div>
    )
}