import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileInformation from '../../components/profile/ProfileInformation';
import RecentOrders from '../../components/profile/RecentOrders';
import SavedAddresses from '../../components/profile/SavedAddresses';

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Profile</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-6">
              <ProfileInformation />
              <RecentOrders />
              <SavedAddresses />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage; 