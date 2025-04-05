
"use client";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const faqs = [
  {
    question: "What is Aakar?",
    answer: "Aakar is a state-level techno-cultural fest that celebrates innovation, creativity, and talent through a wide array of technical events, cultural showcases, workshops, and competitions."
  },
  {
    question: "Who can participate?",
    answer: "Aakar is open to students from all colleges and disciplines across the state and beyond. Whether you're into coding, design, dance, music, or art—there's something for everyone!"
  },
  {
    question: "Is there any registration fee?",
    answer: "Yes, all events at Aakar have a registration fee. Detailed pricing and event-specific fees can be found on the event page."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Absolutely! Participants are welcome to register for multiple events, provided there's no clash in timings between them."
  },
  {
    question: "Will I receive a certificate for participating?",
    answer: "Yes, all registered participants will receive digital certificates of participation. Winners and runners-up will receive special certificates, trophies, and exciting prizes!"
  },
  {
    question: "What happens if I miss my event?",
    answer: "Missing a registered event may lead to disqualification from that particular event. We recommend checking the schedule thoroughly and arriving on time."
  },
  {
    question: "Will there be food and accommodation for participants?",
    answer: "Yes. Food stalls and arrangements will be available at the venue. For outstation participants, accommodation can be arranged on prior request—please contact the coordinators for details."
  },
  {
    question: "Can I bring my own laptop or project materials?",
    answer: "Yes, participants are encouraged to bring their own laptops, tools, or materials as per event requirements. Ensure you comply with the guidelines provided for each event."
  },
  {
    question: "How will I be notified about updates?",
    answer: "Participants will receive updates via email, WhatsApp, and SMS. You can also stay informed by following our official Instagram page: @aakar__2025."
  },
  {
    question: "Who should I contact for support?",
    answer: "For any queries or assistance, please contact us at: 📧 Email: aakarofficial2025@gmail.com | 📞 Phone: +91 9741152696"
  }
];

export default function FAQPage() {
  return (
    <main className={`${montserrat.className} min-h-screen  text-black px-6 py-16`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl  text-white font-bold text-center mb-12">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="border rounded-lg p-4 bg-gray-100 open:bg-gray-200"
            >
              <summary className="cursor-pointer text-lg font-medium">{faq.question}</summary>
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
};

