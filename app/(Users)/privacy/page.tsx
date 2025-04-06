import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen px-6 py-12 text-white bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>

                <section className="space-y-4">
                    <p>
                        At Aakar, we are committed to protecting your privacy. This policy explains how your personal information is collected, used, and safeguarded.
                    </p>

                    <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                    <p>
                        We may collect personal information such as your name, email address, phone number, college name, and selected events during registration.
                    </p>

                    <h2 className="text-2xl font-semibold">2. Use of Information</h2>
                    <p>
                        Your data will be used only for fest-related communication, verification, and updates. We will never sell or share your information with third parties.
                    </p>

                    <h2 className="text-2xl font-semibold">3. Data Security</h2>
                    <p>
                        We take appropriate measures to protect your data from unauthorized access, alteration, or disclosure.
                    </p>

                    <h2 className="text-2xl font-semibold">4. Third-Party Links</h2>
                    <p>
                        Our website may contain links to external websites. We are not responsible for their privacy practices or content.
                    </p>

                    <h2 className="text-2xl font-semibold">5. Consent</h2>
                    <p>
                        By using our website and registering for Aakar, you consent to our privacy policy.
                    </p>

                    <h2 className="text-2xl font-semibold">6. Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy occasionally. All changes will be reflected on this page with the updated date.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;