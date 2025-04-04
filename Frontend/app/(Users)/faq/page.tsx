
"use client";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const faqs = [
  {
    question: "What is Aakar?",
    answer: "Aakar is a technical festival that showcases innovation, creativity, and engineering excellence."
  },
  {
    question: "Who can participate?",
    answer: "Students from all colleges and disciplines are welcome to participate in Aakar events."
  },
  {
    question: "Is there any registration fee?",
    answer: "Most events are free, but some workshops or competitions may require a small fee."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Yes! You can register for multiple events as long as there is no *time conflict* between them"
  },
  {
    question: " Will I receive a certificate for participating?",
    answer: "Yes, all participants will receive a *certificate of participation. Winners will receive **special certificates, trophies, and prizes* based on the event.  "
  },
  {
    question: "What happens if I miss my event?",
    answer: "If you fail to attend an event you registered for, you may not be eligible for participation or refunds. Make sure to check your schedule in advance.    "
  },
  {
    question: "Will there be food and accommodation for participants?",
    answer: "Food: Available at the venue (may be free or paid, depending on arrangements).Accommodation: If required, please contact the organizers in advance.  "
  },
  {
    question: "Can I bring my own laptop or project materials?",
    answer: "Yes, participants are encouraged to bring their own *laptops, project kits, or any required materials*. However, ensure they comply with event guidelines.  "
  },
  {
    question: "How will I be notified about updates?",
    answer: "Important updates will be sent via *email, SMS, and WhatsApp*. Follow our official social media pages for live updates.  "
  },
  {
    question: "Who should I contact for support?",
    answer: "For any queries, you can contact us at:  📧 *Email:* [shreedevisambhram@gmail.com]  📞 *Phone:* [+91 9741152696] "
  },

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

