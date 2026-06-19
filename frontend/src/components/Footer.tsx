import { Facebook, Instagram, Youtube, Award, CreditCard, ShieldCheck, CheckSquare, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-12 px-6 sm:px-12 border-t border-[#74070e]/10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 text-[13px] leading-relaxed mb-10">
        
        {/* Column 1: Address and Contacts */}
        <div className="lg:col-span-1.5 space-y-3.5 pr-4">
          <p className="text-gray-800 font-light tracking-wide">
            Địa chỉ: 118 Linh Trung, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh
          </p>
          <p className="text-gray-800 font-light tracking-wide">
            Hotline: 0881 1880 080
          </p>
          <p className="text-gray-800 font-light tracking-wide">
            Email: contact.cheri@gmail.com
          </p>
        </div>

        {/* Column 2: Support */}
        <div className="space-y-4">
          <h4 
            className="text-[#74070e] font-serif text-[15px] font-normal tracking-wider"
          >
            HỖ TRỢ
          </h4>
          <ul className="space-y-2.5 font-light text-gray-600">
            <li>
              <a href="#guide" className="hover:text-[#74070e] transition-colors cursor-pointer">
                Hướng dẫn đặt hàng
              </a>
            </li>
            <li>
              <a href="#faqs" className="hover:text-[#74070e] transition-colors cursor-pointer">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div className="space-y-4">
          <h4 
            className="text-[#74070e] font-serif text-[15px] font-normal tracking-wider"
          >
            CHÍNH SÁCH
          </h4>
          <ul className="space-y-2.5 font-light text-gray-600">
            <li>
              <a href="#swap-policy" className="hover:text-[#74070e] transition-colors cursor-pointer">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#warranty-policy" className="hover:text-[#74070e] transition-colors cursor-pointer">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#privacy-policy" className="hover:text-[#74070e] transition-colors cursor-pointer">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#shipping-policy" className="hover:text-[#74070e] transition-colors cursor-pointer">
                Chính sách vận chuyển - giao hàng
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Badges */}
        <div className="space-y-4">
          <h4 
            className="text-[#74070e] font-serif text-[15px] font-normal tracking-wider"
          >
            MẠNG XÃ HỘI
          </h4>
          <div className="flex items-center space-x-3">
            {/* Facebook custom badge colored in screenshot */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full bg-[#1877F2]/90 text-white flex items-center justify-center transition-transform hover:scale-105"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>

            {/* Instagram colored circular badge */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full bg-[#E1306C]/90 text-white flex items-center justify-center transition-transform hover:scale-105"
              style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" }}
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>

            {/* YouTube colored circular badge */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full bg-[#FF0000]/90 text-white flex items-center justify-center transition-transform hover:scale-105"
            >
              <Youtube className="w-4.5 h-4.5" />
            </a>

            {/* TikTok colored circular badge */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full bg-[#000000]/90 text-white flex items-center justify-center transition-transform hover:scale-105"
            >
              <span className="font-bold text-xs select-none">♫</span>
            </a>
          </div>
        </div>

        {/* Column 5: Payment Methods */}
        <div className="space-y-4">
          <h4 
            className="text-[#74070e] font-serif text-[15px] font-normal tracking-wider"
          >
            THANH TOÁN
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="border border-[#74070e]/10 rounded px-2.5 py-1 flex items-center space-x-1" title="Visa / Master Card">
              <CreditCard className="w-3.5 h-3.5 text-[#74070e]/60" />
              <span className="text-[9px] font-medium tracking-wider text-gray-500">CARD</span>
            </div>
            <div className="border border-[#74070e]/10 rounded px-2.5 py-1 flex items-center space-x-1" title="Chuyển khoản Ngân hàng">
              <ShieldCheck className="w-3.5 h-3.5 text-[#74070e]/60" />
              <span className="text-[9px] font-medium tracking-wider text-gray-500">TRANSFER</span>
            </div>
            <div className="border border-[#74070e]/10 rounded px-2.5 py-1 flex items-center space-x-1" title="Thanh toán khi nhận hàng COD">
              <CheckSquare className="w-3.5 h-3.5 text-[#74070e]/60" />
              <span className="text-[9px] font-medium tracking-wider text-gray-500">COD</span>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-[#74070e]/10 pt-7 text-center">
        <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase">
          © 2026 Chéri. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
