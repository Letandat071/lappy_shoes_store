import React from 'react';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

const TeamSection = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Jane Smith",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Mike Johnson",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex space-x-4">
                  {member.linkedin && (
                    <Link href={member.linkedin} className="text-gray-400 hover:text-black">
                      <i className="fab fa-linkedin"></i>
                    </Link>
                  )}
                  {member.twitter && (
                    <Link href={member.twitter} className="text-gray-400 hover:text-black">
                      <i className="fab fa-twitter"></i>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 