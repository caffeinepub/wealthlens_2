import { Outlet } from "@tanstack/react-router";
import ProfileSetupModal from "../ProfileSetupModal";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProfileSetupModal />
      <main className="pt-14 min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
