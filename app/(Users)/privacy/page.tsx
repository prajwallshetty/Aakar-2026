import React from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
    weight: '600',
    subsets: ['latin'],
});

const privacy = [
    {
        title: '',
        content:
            'At Aakar, we are committed to protecting your privacy. This policy explains how your personal information is collected, used, and safeguarded.',
    },
    {
        title: '1. Information We Collect',
        content:
            'We may collect personal information such as your name, email address, phone number, college name, and selected events during registration.',
    },
    {
        title: '2. Use of Information',
        content:
            'Your data will be used only for fest-related communication, verification, and updates. We will never sell or share your information with third parties.',
    },
    {
        title: '3. Data Security',
        content:
            'We take appropriate measures to protect your data from unauthorized access, alteration, or disclosure.',
    },
    {
        title: '4. Third-Party Links',
        content:
            'Our website may contain links to external websites. We are not responsible for their privacy practices or content.',
    },
    {
        title: '5. Consent',
        content:
            'By using our website and registering for Aakar, you consent to our privacy policy.',
    },
    {
        title: '6. Changes to This Policy',
        content:
            'We may update this privacy policy occasionally. All changes will be reflected on this page with the updated date.',
    },
];

const PrivacyPolicyPage = () => {
    return (
        <div className={`min-h-screen px-6 py-12 text-white ${montserrat.className}`}>
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>

                <section className="space-y-4">
                    {privacy.map(({ title, content }, idx) => (
                        <div key={idx}>
                            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
                            <p>{content}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;