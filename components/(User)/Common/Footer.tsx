import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

const Footer = () => {
  return (
    <section className={`bg-black text-white py-10 px-5 ${montserrat.className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-medium mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><Link href='/' className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link href='/about' className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href='/contact' className="text-gray-400 hover:text-white">Contact Us</Link></li>
            <li><Link href='/team' className="text-gray-400 hover:text-white">Our Team</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Contact Us</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-400 hover:text-white">
              <FaInstagram />
              <Link href="https://www.instagram.com/aakar__2025/" target="_blank" rel="noopener noreferrer">
                @aakar_25
              </Link>
            </li>
            <li className="flex items-center gap-2 text-gray-400 hover:text-white">
              <FaPhone />
              <Link href="tel:+919611829800" target="_blank" rel="noopener noreferrer">
                +91 96118 29800
              </Link>
            </li>
            <li className="flex items-center gap-2 text-gray-400 hover:text-white">
              <FaEnvelope />
              <Link href="mailto:aakaar2025@ajiet.edu.in" target="_blank" rel="noopener noreferrer">
                aakar2025@ajiet.edu.in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Address</h4>
          <p className="text-gray-400 max-w-xs">
            NH66, Kottara Chowki, Mangaluru,<br />
            Karnataka - 575006
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-10">
        Designed and developed by the Aakar Technical Committee, AJIET.
      </p>
    </section>
  );
};

export default Footer;