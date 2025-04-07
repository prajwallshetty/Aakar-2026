import React from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
    weight: '600',
    subsets: ['latin'],
});

const termsSections = [
    {
        title: '',
        content:
            'Welcome to Aakar! These terms and conditions outline the rules and regulations for the use of our website and participation in the fest.',
    },
    {
        title: '1. Acceptance of Terms',
        content:
            'By accessing this website and registering for events, you agree to be bound by these terms and all applicable laws and regulations.',
    },
    {
        title: '2. Event Participation',
        content:
            'Participants must provide accurate information while registering. The organizing team reserves the right to disqualify entries for misrepresentation or inappropriate behavior.',
    },
    {
        title: '3. Intellectual Property',
        content:
            'All content, including logos, graphics, and event names, are the intellectual property of Aakar and may not be reproduced without permission.',
    },
    {
        title: '4. Changes to Events',
        content:
            'The organizers reserve the right to modify or cancel events without prior notice due to unforeseen circumstances.',
    },
    {
        title: '5. Code of Conduct',
        content:
            'All attendees are expected to maintain respectful behavior throughout the fest. Harassment or misconduct of any form will not be tolerated.',
    },
    {
        title: '6. Liability',
        content:
            'Aakar is not responsible for any loss, damage, or injury incurred during the event, whether on campus or online.',
    },
];

const TermsPage = () => {
    return (
        <div className="min-h-screen px-6 py-12 text-white">
            <div className={`max-w-4xl mx-auto space-y-8 ${montserrat.className}`}>
                <h1 className="text-4xl font-bold text-center">Terms & Conditions</h1>

                <section className="space-y-4">
                    {termsSections.map(({ title, content }, index) => (
                        <div key={index}>
                            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
                            <p>{content}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default TermsPage;