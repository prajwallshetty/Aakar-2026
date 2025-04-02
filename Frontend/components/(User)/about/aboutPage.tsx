import Image from "next/image"
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
})

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 bg-cover bg-center bg-no-repeat py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">About Our Institute</h1>
          </div>

          {/* First section - Institute info */}
          <div className="rounded-xl overflow-hidden mb-16 border-2 border-transparent">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <Image
                  src="/co.jpg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="AJ Institute Campus"
                  className="w-full object-cover rounded-lg"
                />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <h2 className="text-3xl font-bold text-white mb-6 text-center md:text-left">
                  AJ INSTITUTE OF ENGINEERING AND TECH
                </h2>
                <div className={`space-y-4 text-white ${montserrat.className}`}>
                  <p className="text-lg">Established in 2005, Kottara, Mangaluru</p>
                  <p className="text-lg">Affiliated to Visvesvaraya Technological University, Belagavi</p>
                  <p className="text-lg">Recognized by All India Council for Technical Education (AICTE), New Delhi</p>
                </div>
              </div>
            </div>
            <div className={`p-8 py-16 ${montserrat.className}`}>
              <p className={`text-lg text-white mb-6 ${montserrat.className}`}>
              A J Institute of Engineering & Technology is promoted by Laxmi Memorial Education Trust which was registered in the year 1991 in the memory of Late Laxmi Shetty, mother of Dr. A. J. Shetty, who is the President and Managing Director of the Trust. 
                </p>
                <p className="text-lg text-white mb-6">
                The main objective of the institution is to impart high quality theoretical knowledge, ably and well supported by adequate practice in laboratories, workshop, drawing rooms etc. to turn the student into a highly competent professional and at the same time an exemplary human being in the service of the state and the nation and to become a proud global citizen.
                </p>
                <p className="text-lg text-white">
                In this direction the institution considers STUDENT as the most important person in the campus and all staff members and all other persons connected with the institution are required to orchestrate all their activities to the student requirements.
                </p>
              </div>
          </div>

          {/* Second section - AAKAR */}
          <div className="rounded-xl overflow-hidden mt-12 p-6 md:p-10 border-2 border-transparent">
            <div className="mx-auto">
              <h2 className="text-4xl font-bold text-center text-white mb-8">
                AAKAR
              </h2>

              <div className="flex flex-col justify-center items-center gap-4 mb-8">
                <div className="text-white text-center px-4 py-2 rounded-lg border-2">
                  <p className={`text-lg font-semibold ${montserrat.className}`}>December 6th - 7th, 2024</p>
                </div>
                <div className={`text-white text-center px-4 py-2 rounded-lg border-2 ${montserrat.className}`}>
                  <p className="text-lg font-semibold">
                    Laxmi Memorial Institute of Engineering and Technology, Kottarachowki, Mangaluru
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="w-full md:w-1/2">
                  <p className={`text-lg text-white mb-6 ${montserrat.className}`}>
                    Our institution stands as a beacon of academic brilliance in the region, committed to fostering
                    innovation and excellence in engineering education.
                  </p>
                  <p className={`text-lg text-white mb-6 ${montserrat.className}`}>
                    At AJ Institute of Engineering and Technology, we believe in providing a holistic educational experience
                    that combines rigorous academic training with practical skills development. Our curriculum is designed
                    to meet industry standards while encouraging creative thinking and problem-solving abilities.
                  </p>
                </div>

                <div className="w-full md:w-1/2">
                  <Image
                    src="/co.jpg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="AJ Institute Campus"
                    className="w-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <div className={`w-full md:w-2/3 text-white p-4 rounded-lg border-2 ${montserrat.className}`}>
                  <h3 className="text-xl font-bold mb-4">Event Details</h3>
                  <p className="text-lg">
                    This event will feature technical workshops, cultural programs, and networking opportunities for students and professionals alike.
                  </p>
                </div>
              </div>

              {/* Previous Year Highlights */}
              <div className="pt-16">
                <h2 className="text-4xl font-bold text-center text-white mb-8">
                  Previous Year Highlights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/co.jpg"
                        width={400}
                        height={300}
                        alt={`Highlight ${num}`}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}