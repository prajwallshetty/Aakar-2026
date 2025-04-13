import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

interface TeamCategory {
    name: string;
    members: TeamMember[];
}

const teamData: TeamCategory[] = [
    {
        name: 'Mentorship Panel',
        members: [
            { name: 'Mr. Vinod T Dsouza', role: 'Chief Co-ordinator', image: '/Team/lecturer/vinod.png' },
            { name: 'Dr. Suhan Das', role: 'Faculty Co-ordinator', image: '/Team/lecturer/suhan.png' },
            { name: 'Ms. Disha C Shetty', role: 'Faculty Co-ordinator', image: '/Team/lecturer/disha.jpg' },
            { name: 'Mrs. Sharanya P S', role: 'Faculty Co-ordinator', image: '/Team/lecturer/sharanya.png' },
        ],
    },
    {
        name: 'Core Committee',
        members: [
            { name: 'Ayan A Thonse', role: 'President', image: '/Team/Core-Committee/ayan.jpg' },
            { name: 'Aawan Shaikh', role: 'Vice President', image: '/Team/Core-Committee/aawan.jpg' },
            { name: 'Anaum Fathima', role: 'Secretary', image: '/Team/Core-Committee/anaum.jpg' },
            { name: 'Shreya Dk', role: 'Cultural Lead', image: '/Team/Core-Committee/shreya.jpg' },
            { name: 'Thashvy S Suvarna', role: 'Creative Lead', image: '/Team/Core-Committee/thashvy.jpg' },
            { name: 'Manya Shetty', role: 'Management Lead', image: '/Team/Core-Committee/manya.jpg' },
            { name: 'Sahana', role: 'Media Lead', image: '/Team/Core-Committee/sahana.jpg' },
            { name: 'Gauresh G Pai', role: 'Technical Lead', image: '/Team/Core-Committee/gauresh.png' },
            { name: 'Monith K', role: 'Design Lead', image: '/Team/Core-Committee/monith.jpg' },
            { name: 'Jnanesh', role: 'Web Lead', image: '/Team/Core-Committee/Jnanesh.jpg' },
            { name: 'Nishanth Shetty B', role: 'Executive Member', image: '/Team/Core-Committee/nishant.jpg' },
            { name: 'Thanisha Devadiga', role: 'Executive Member', image: '/Team/Core-Committee/thanisha.jpg' },
            { name: 'Farhan', role: 'Executive Member', image: '/Team/Core-Committee/farhan.jpg' },
        ],
    },
];

const shapeImages = {
    0: '/teamcard-2-triangle.png',
    1: '/teamcard-1-square.png',
    2: '/teamcard-3-circle.png',
};

const Team = () => {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4">
            <h1 className="text-white text-4xl font-bold mb-12 font-GameOfSquids">OUR TEAM</h1>

            {teamData.map((category) => (
                <div key={category.name} className="max-w-7xl">
                    <h2 className="text-white text-2xl font-semibold mb-8 text-center">
                        {category.name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0 justify-center relative top-20">
                        {category.members.map((member, index) => {
                            const shapeIndex = index % 3;
                            const shapeImage = shapeImages[shapeIndex as 0 | 1 | 2];

                            return (
                                <Card key={index} className="relative w-[300] h-[69%] mx-auto">
                                    <CardContent className="p-4">
                                        <div className="absolute -top-17 left-1/2 transform -translate-x-1/2 w-30 h-30 z-3">
                                            <Image
                                                src={shapeImage}
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
                                                width={1080}
                                                height={1080}
                                                className="rounded-xl w-full aspect-square object-cover relative -top-7 z-2"
                                            />
                                        </div>
                                    </CardContent>
                                    <div className="bg-black/55 text-white text-center p-3 rounded-b-2xl relative left-4 bottom-35 z-2 w-[266]">
                                        <h2 className="text-lg font-semibold truncate">{member.name}</h2>
                                        <p className="text-sm opacity-90">{member.role}</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Team;