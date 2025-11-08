"use client";

import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black text-gray-400 py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        {/* Left - Credits */}
        <p className="text-center md:text-left">
          {new Date().getFullYear()}{" "}
          <span className="text-yellow-200 font-medium hover:text-yellow-400 transition-colors">
            KDevStudio
          </span>
          . All rights reserved.
        </p>

        {/* Center - Website link */}
        <a
          href="https://kdevstudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 font-semibold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Website created by KDevStudio.com
        </a>

        {/* Right - Contact */}
        <div className="flex items-center gap-5">
          <a
            href="tel:5057303444"
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Phone className="w-4 h-4 text-yellow-200" />
            <span>(505) 730-3444</span>
          </a>
          <a
            href="mailto:nkhang505@gmail.com"
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Mail className="w-4 h-4 text-yellow-200" />
            <span>nkhang505@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
