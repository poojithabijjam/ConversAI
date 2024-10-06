import Header from '@/components/Header';
import "../globals.css";

function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className='flex flex-col'>
        <Header/>
            <div>
                {/* Sidebar */}
                <div>
                    {children}
                </div>
            </div>
        </div>

    )
}
export default AdminLayout