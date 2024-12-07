import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6">
    <div className="container mx-auto text-center md:text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mx-5">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Smart Parking System</h3>
          <p>
            Một giải pháp thông minh để quản lý chỗ đỗ xe hiệu quả và hiệu quả. Được xây dựng với công nghệ hiện đại giúp tiết kiệm thời gian và công sức của bạn.          
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/find-spot" className="hover:underline">Find Spot</a></li>
            <li><a href="/account" className="hover:underline">User Account</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FaInstagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-700 mx-5" />

      <p className="text-sm mx-5">&copy; 2024 Smart Parking Management System.</p>
    </div>
  </footer>
);

export default Footer;
