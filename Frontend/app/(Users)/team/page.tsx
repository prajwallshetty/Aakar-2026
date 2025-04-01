import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  shape: 'square' | 'circle' | 'triangle';
}

interface TeamCategory {
  name: string;
  members: TeamMember[];
}

const teamData: TeamCategory[] = [
  {
    name: 'Core Committee',
    members: [

      {
        name: 'AYAN A THONSE',
        role: 'MEMBER',
        image: '/Team/Core-Committee/ayan.jpg',
        shape: 'triangle',
      },
      {
        name: 'GAURESH G PAI',
        role: 'WEB LEAD',
        image: '/Team/Core-Committee/gauresh.png',
        shape: 'square',
      },
      {
        name: 'SHREYA DK',
        role: 'MEMBER',
        image: '/Team/Core-Committee/shreya.jpg',
        shape: 'circle',
      },
      {
        name: 'ANAUM FATHIMA',
        role: 'MEMBER',
        image: '/Team/Core-Committee/anaum.jpg',
        shape: 'triangle',
      },
      {
        name: 'THASHVY S SUVARNA',
        role: 'MEMBER',
        image: '/Team/Core-Committee/thashvy.jpg',
        shape: 'square',
      },
      {
        name: 'MOHAMMAD AAWAN SHAIKH',
        role: 'MEMBER',
        image: '/Team/Core-Committee/aawan.jpg',
        shape: 'circle',
      },
      {
        name: 'THANISHA DEVADIGA',
        role: 'MEMBER',
        image: '/Team/Core-Committee/thanisha.jpg',
        shape: 'triangle',
      },
      {
        name: 'NISHANTH SHETTY B',
        role: 'MEMBER',
        image: '/Team/Core-Committee/nishant.jpg',
        shape: 'square',
      },
      {
        name: 'Manya',
        role: 'MEMBER',
        image: '/Team/Core-Committee/manya.jpg',
        shape: 'circle',
      },
      {
        name: 'Sahana',
        role: 'MEMBER',
        image: '/Team/Core-Committee/sahana.jpg',
        shape: 'triangle',
      },
      {
        name: 'Farhan',
        role: 'MEMBER',
        image: '/Team/Core-Committee/farhan.jpg',
        shape: 'square',
      },
      {
        name: 'MONITH K',
        role: 'MEMBER',
        image: '/Team/Core-Committee/monith.jpg',
        shape: 'circle',
      },
    ],
  },
  {
    name: 'Executive',
    members: [
      {
        name: 'Dr. A. J. Shetty',
        role: 'Chairman, LMET',
        image: '/Team/executive/ajshetty.png',
        shape: 'triangle',
      },
      {
        name: 'Mrs. Sharada J. Shetty',
        role: 'Director, LMET',
        image: '/Team/executive/sharadha.png',
        shape: 'square',
      },
      {
        name: 'Mr. Prashanth Shetty',
        role: 'Vice President, LMET',
        image: '/Team/executive/prashanth.png',
        shape: 'circle',
      },
      {
        name: 'Mrs. Ashritha P. Shetty',
        role: 'Director, LMET',
        image: '/Team/executive/ashritha.png',
        shape: 'triangle',
      },
      {
        name: 'Dr. Prashanth Marla K',
        role: 'Director, LMET',
        image: '/Team/executive/prashanthM.png',
        shape: 'square',
      },

      {
        name: 'Dr. Amitha P. Marla',
        role: 'Director, LMET',
        image: '/Team/executive/amithaM.png',
        shape: 'circle',
      },
      {
        name: 'Mr. Ranga B. Shetty',
        role: 'Director, LMET',
        image: '/Team/executive/ranga.png',
        shape: 'triangle',
      },
      {
        name: 'Mrs. Vinuth R. Shetty',
        role: 'Director, LMET',
        image: '/Team/executive/vinutha.png',
        shape: 'square',
      },


    ],
  },
  {
    name: 'Lecturers',
    members: [
      {
        name: 'LECTURER 1',
        role: 'DEPARTMENT',
        image: '/Team/Lecturers/lecturer1.jpg',
        shape: 'triangle',
      },
    ],
  },
];

const shapeImages = {
  square: '/teamcard-1-square.png',
  circle: '/teamcard-3-circle.png',
  triangle: '/teamcard-2-triangle.png',
};

const TeamPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-white text-4xl font-bold mb-12">OUR TEAM</h1>

      {teamData.map((category) => (
        <div key={category.name} className="w-full max-w-7xl">
          <h2 className="text-white text-2xl font-semibold mb-8 text-center">
            {category.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center relative top-20">
            {category.members.map((member, index) => (
              <Card key={index} className="relative  w-[300] h-[73%] mx-auto">
                <CardContent className="p-4">
                  <div className="absolute -top-17 left-1/2 transform -translate-x-1/2 w-30 h-30 z-3">
                    <Image
                      src={shapeImages[member.shape]}
                      alt="shape"
                      width={1080}
                      height={1080}
                      className="object-contain  "
                    />
                  </div>

                  <div className="pt-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="rounded-xl w-full aspect-square object-cover relative -top-6 z-2 "
                    />
                  </div>
                </CardContent>
                <div className="bg-black/55 text-white text-center p-3 rounded-b-2xl relative left-4 bottom-34 z-2 w-[266]">
                  <h2 className="text-lg font-semibold truncate">{member.name}</h2>
                  <p className="text-sm opacity-90">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamPage;