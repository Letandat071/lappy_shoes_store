import React from 'react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    bio: 'Passionate about creating innovative footwear solutions.'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Award-winning designer with 10+ years of experience.'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    bio: 'Expert in bringing innovative products to market.'
  }
];

const TeamSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Our Team</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Meet the passionate individuals behind Lappy Shoes who work tirelessly to bring you the best footwear experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-primary-600 font-medium mb-4">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
              <div className="flex justify-center space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-primary-600">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 