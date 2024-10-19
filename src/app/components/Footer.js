export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              We provide reliable services for your business needs. Connect with us for quality and innovation.
            </p>
          </div>
  
          {/* Column 2 - Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
            </ul>
          </div>
  
          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p className="text-gray-400">
              Email: contact@yourcompany.com
            </p>
            <p className="text-gray-400">
              Phone: +123 456 7890
            </p>
  
            {/* Social Media Icons */}
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 001.88-2.37 8.44 8.44 0 01-2.71 1.04 4.22 4.22 0 00-7.19 3.85A12 12 0 013 4.67a4.22 4.22 0 001.3 5.63 4.2 4.2 0 01-1.91-.53v.05a4.24 4.24 0 003.38 4.15 4.3 4.3 0 01-1.9.07 4.23 4.23 0 003.94 2.92 8.48 8.48 0 01-5.26 1.81A12 12 0 0010.29 22c7.73 0 11.95-6.39 11.95-11.95l-.01-.54A8.58 8.58 0 0024 5.32a8.35 8.35 0 01-2.54.7z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.16c-5.48 0-9.94 4.46-9.94 9.94 0 5.48 4.46 9.94 9.94 9.94s9.94-4.46 9.94-9.94c0-5.48-4.46-9.94-9.94-9.94zm0 18.14c-4.49 0-8.14-3.65-8.14-8.14 0-4.49 3.65-8.14 8.14-8.14 4.49 0 8.14 3.65 8.14 8.14 0 4.49-3.65 8.14-8.14 8.14zm-1.33-12.83v5.26h-1.68v-5.26h1.68zm.83 6.16c-.59 0-1.07.48-1.07 1.07s.48 1.07 1.07 1.07 1.07-.48 1.07-1.07-.48-1.07-1.07-1.07zm2.32-6.16v5.26h-1.68v-5.26h1.68z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.16c-5.48 0-9.94 4.46-9.94 9.94 0 5.48 4.46 9.94 9.94 9.94s9.94-4.46 9.94-9.94c0-5.48-4.46-9.94-9.94-9.94zm0 18.14c-4.49 0-8.14-3.65-8.14-8.14 0-4.49 3.65-8.14 8.14-8.14 4.49 0 8.14 3.65 8.14 8.14 0 4.49-3.65 8.14-8.14 8.14zm-1.33-12.83v5.26h-1.68v-5.26h1.68zm.83 6.16c-.59 0-1.07.48-1.07 1.07s.48 1.07 1.07 1.07 1.07-.48 1.07-1.07-.48-1.07-1.07-1.07zm2.32-6.16v5.26h-1.68v-5.26h1.68z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
  
        {/* Bottom Line */}
        <div className="text-center text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
        </div>
      </footer>
    );
  }
  