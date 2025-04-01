import Image from "next/image"
import Navbar from "@/components/Common/Navbar"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div 
        className="flex-1 bg-cover bg-center bg-no-repeat py-16 px-4 "
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">About Our Institute</h1>
          </div>

          <div className="rounded-xl shadow-md overflow-hidden mb-12 border-2 border-transparent">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-6 text-center md:text-left">
                  AJ INSTITUTE OF ENGINEERING AND TECH
                </h2>
                <div className="space-y-4 text-white">
                  <p className="text-lg">Established in 2005, Kottara, Mangaluru</p>
                  <p className="text-lg">Affiliated to Visvesvaraya Technological University, Belagavi</p>
                  <p className="text-lg">Recognized by All India Council for Technical Education (AICTE), New Delhi</p>
                </div>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/co.jpg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="AJ Institute Campus"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl shadow-md overflow-hidden mb-12 border-2 border-transparent">
            <div className="md:flex items-center">
              <div className="md:w-1/2">
                <Image
                  src="/co.jpg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="AJ Institute Campus"
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="md:w-1/2  p-8 md:p-12">
              <p className="text-lg text-white mb-6">
                  Our institution stands as a beacon of academic brilliance in the region, committed to fostering
                  innovation and excellence in engineering education. With state-of-the-art facilities and a dedicated
                  faculty, we strive to nurture the next generation of engineers and technologists.
                </p>
                <p className="text-lg text-white mb-6">
                  At AJ Institute of Engineering and Technology, we believe in providing a holistic educational experience
                  that combines rigorous academic training with practical skills development. Our curriculum is designed
                  to meet industry standards while encouraging creative thinking and problem-solving abilities.
                </p>
                <p className="text-lg text-white">
                  Since our inception, we have maintained a strong focus on research and development, collaborating with
                  industry partners to ensure our students are well-prepared for the challenges of the professional world.
                  Our alumni have gone on to make significant contributions in various fields of engineering and
                  technology across the globe.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-md overflow-hidden mt-12 p-8 md:p-12 border-2 border-transparent">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-white mb-8">
                Shree Devi Samaramb
              </h2>

              <div className="flex flex-col justify-center items-center gap-4 mb-8">
                <div className="text-white text-center px-4 py-2 rounded-lg shadow-md border-2">
                  <p className="text-lg font-semibold">December 6th - 7th, 2024</p>
                </div>
                <div className="text-white text-center px-4 py-2 rounded-lg shadow-md border-2">
                  <p className="text-lg font-semibold">
                    Shree Devi Institute of Technology, Airport Road, Kenjar, Mangaluru
                  </p>
                </div>
              </div>

              <div className="md:flex md:items-center md:space-x-8">
                <div className="md:w-2/3">
                  <p className="text-lg text-white mb-6">
                    Our institution stands as a beacon of academic brilliance in the region, committed to fostering
                    innovation and excellence in engineering education. With state-of-the-art facilities and a dedicated
                    faculty, we strive to nurture the next generation of engineers and technologists.
                  </p>
                  <p className="text-lg text-white mb-6">
                    At AJ Institute of Engineering and Technology, we believe in providing a holistic educational experience
                    that combines rigorous academic training with practical skills development. Our curriculum is designed
                    to meet industry standards while encouraging creative thinking and problem-solving abilities.
                  </p>
                  <p className="text-lg text-white">
                    Since our inception, we have maintained a strong focus on research and development, collaborating with
                    industry partners to ensure our students are well-prepared for the challenges of the professional world.
                    Our alumni have gone on to make significant contributions in various fields of engineering and
                    technology across the globe.
                  </p>
                </div>

                <div className="md:w-1/3 mb-6 md:mb-0">
                  <Image
                    src="/co.jpg?height=300&width=300"
                    width={300}
                    height={300}
                    alt="Institution Image"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="md:w-1/2  text-white p-4 rounded-lg shadow-md mt-8 border-2">
                <h3 className="text-xl font-bold mb-4">Event Details</h3>
                <p className="text-lg">
                  This event will feature technical workshops, cultural programs, and networking opportunities for students and professionals alike.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-4xl font-bold text-center text-white mb-8">
                  Previous Year Highlights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/co.jpg"
                      width={400}
                      height={300}
                      alt="Highlight 1"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/co.jpg"
                      width={400}
                      height={300}
                      alt="Highlight 2"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/co.jpg"
                      width={400}
                      height={300}
                      alt="Highlight 3"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/co.jpg"
                      width={400}
                      height={300}
                      alt="Highlight 4"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/co.jpg"
                      width={400}
                      height={300}
                      alt="Highlight 5"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/co.jpg"
                      width={400}
                      height={300}
                      alt="Highlight 6"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
