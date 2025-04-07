import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        name: 'Executive Committee',
        members: [
            { name: 'Dr. A. J. Shetty', role: 'Chairman, LMET', image: '/Team/executive/ajshetty.png' },
            { name: 'Mrs. Sharada J. Shetty', role: 'Director, LMET', image: '/Team/executive/sharadha.png' },
            { name: 'Mr. Prashanth Shetty', role: 'Vice President, LMET', image: '/Team/executive/prashanth.png' },
            { name: 'Mrs. Ashritha P. Shetty', role: 'Director, LMET', image: '/Team/executive/ashritha.png' },
            { name: 'Dr. Prashanth Marla K', role: 'Director, LMET', image: '/Team/executive/prashanthM.png' },
            { name: 'Dr. Amitha P. Marla', role: 'Director, LMET', image: '/Team/executive/amithaM.png' },
            { name: 'Mr. Ranga B. Shetty', role: 'Director, LMET', image: '/Team/executive/ranga.png' },
            { name: 'Mrs. Vinuth R. Shetty', role: 'Director, LMET', image: '/Team/executive/vinutha.png' },
            { name: 'Shantharama Rai. C.', role: 'Principal, AJIET', image: '/Team/executive/princi.jpg' },
            { name: 'Dr. Antony P.J.', role: 'Vice Principal, AJIET', image: '/Team/executive/vice.jpg' },
            { name: 'Dr. P.Mahabaleswarappa', role: 'Dean, AJIET', image: '/Team/executive/dean.jpg' },
        ],
    },
    {
        name: 'Mentorship Panel',
        members: [
            { name: 'Mr. Vinod T Dsouza', role: 'Main Coordinator', image: '/Team/lecturer/vinod.png' },
            { name: 'Mr. Suhan Das', role: 'Faculty Mentor', image: '/Team/lecturer/suhan.png' },
            { name: 'Mrs. Sharanya P S', role: 'Faculty Mentor', image: '/Team/lecturer/sharanya.png' },
            { name: 'Ms. Disha C Shetty', role: 'Faculty Mentor', image: '/Team/lecturer/disha.jpg' },
        ],
    },
    {
        name: 'Core Committee',
        members: [
            { name: 'Ayan A Thonse', role: 'President', image: '/Team/Core-Committee/ayan.jpg' },
            { name: 'Aawan Shaikh', role: 'Vice President', image: '/Team/Core-Committee/aawan.jpg' },
            { name: 'Anaum Fathima', role: 'Secretary', image: '/Team/Core-Committee/anaum.jpg' },
            { name: 'Shreya Dk', role: 'Culture Lead', image: '/Team/Core-Committee/shreya.jpg' },
            { name: 'Thashvy S Suvarna', role: 'Tech Lead', image: '/Team/Core-Committee/thashvy.jpg' },
            { name: 'Manya Shetty', role: 'Management Lead', image: '/Team/Core-Committee/manya.jpg' },
            { name: 'Sahana', role: 'Media Lead', image: '/Team/Core-Committee/sahana.jpg' },
            { name: 'Monith K', role: 'Design Lead', image: '/Team/Core-Committee/monith.png' },
            { name: 'Gauresh G Pai', role: 'Web Lead', image: '/Team/Core-Committee/gauresh.png' },
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