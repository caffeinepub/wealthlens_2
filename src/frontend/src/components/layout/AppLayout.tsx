import { Outlet } from "@tanstack/react-router";
import ProfileSetupModal from "../ProfileSetupModal";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      <ProfileSetupModal />
      <main className="pl-14 pt-14 min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
      <div className="pl-14">
        <Footer />
      </div>
    </div>
  );
}
