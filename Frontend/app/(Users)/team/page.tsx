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
        shape: 'triangle',
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
        shape: 'square',
      },
      {
        name: 'THASHVY S SUVARNA',
        role: 'MEMBER',
        image: '/Team/Core-Committee/thashvy.jpg',
        shape: 'triangle',
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
        shape: 'square',
      },
      {
        name: 'NISHANTH SHETTY B',
        role: 'MEMBER',
        image: '/Team/Core-Committee/nishant.jpg',
        shape: 'circle',
      },
      {
        name: 'Manya',
        role: 'MEMBER',
        image: '/Team/Core-Committee/manya.jpg',
        shape: 'square',
      },
      {
        name: 'Sahana',
        role: 'MEMBER',
        image: '/Team/Core-Committee/sahana.jpg',
        shape: 'square',
      },
      {
        name: 'Farhan',
        role: 'MEMBER',
        image: '/Team/Core-Committee/farhan.jpg',
        shape: 'circle',
      },
      {
        name: 'MONITH K',
        role: 'MEMBER',
        image: '/Team/Core-Committee/monith.jpg',
        shape: 'square',
      },
    ],
  },
  {
    name: 'Executive',
    members: [
      {
        name: 'EXECUTIVE 1',
        role: 'ROLE 1',
        image: '/Team/Executive/exec1.jpg',
        shape: 'triangle',
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
        shape: 'circle',
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            {category.members.map((member, index) => (
              <Card key={index} className="relative w-full mx-auto">
                <CardContent className="p-4">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-32">
                    <Image
                      src={shapeImages[member.shape]}
                      alt="shape"
                      width={1080}
                      height={1080}
                      className="object-contain"
                    />
                  </div>

                  <div className="pt-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="rounded-xl w-full aspect-square object-cover"
                    />
                  </div>
                </CardContent>
                <div className="bg-black bg-opacity-70 text-white text-center p-3 rounded-b-2xl">
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