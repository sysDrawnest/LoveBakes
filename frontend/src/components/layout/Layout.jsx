import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#FFF6F2] relative">
            <Navbar />
            <main className="flex-grow w-full pb-20 md:pb-0">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default Layout;
