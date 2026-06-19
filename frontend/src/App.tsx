import React, { useState, useEffect, useMemo } from "react";
import { 
  ArrowRight, Heart, ShoppingBag, Eye, Star, Share2, 
  Trash2, Plus, Minus, Check, MapPin, Phone, Mail, 
  Gift, ShieldCheck, Truck, RefreshCw, Sparkles, LogOut, CheckCircle2, Clock, X,
  Compass, Feather, Globe, Lock, User
} from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbox from "./components/Chatbox";
import { CHERI_PRODUCTS, CHERI_CATEGORIES, BLOGS } from "./data";
import { Product, CartItem, UserProfile, Order, OrderItem } from "./types";

// Avatar presets for Chéri premium profile selection
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
];

// Guest profile fallback template representation
const GUEST_USER: UserProfile = {
  name: "Khách quý Chéri",
  email: "",
  phone: "",
  address: "",
  memberTier: "Bronze",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  orders: []
};

// Default initial user profile if nothing is stored in localStorage
const DEFAULT_USER: UserProfile = {
  name: "Nguyễn Thơ",
  email: "contact.cheri@gmail.com",
  phone: "0881 1880 080",
  address: "118 Linh Trung, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh",
  memberTier: "Gold",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  orders: [
    {
      id: "CR-9582",
      date: "2026-06-01",
      total: 3100000,
      status: "delivered",
      statusText: "Đã giao hàng thành công",
      address: "118 Linh Trung, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh",
      phone: "0881 1880 080",
      items: [
        {
          productId: "1",
          productName: "Áo Sơ Mi Lụa Mulberry (Mulberry Silk Shirt)",
          price: 1250000,
          quantity: 1,
          size: "S",
          colorName: "Đỏ Chéri Trầm"
        },
        {
          productId: "3",
          productName: "Áo Blazer Dạ Tweed Phối Khuy Gold",
          price: 1850000,
          quantity: 1,
          size: "M",
          colorName: "Trắng Ivory"
        }
      ]
    }
  ]
};

export default function App() {
  // Page Routing State: "home" | "products" | "about" | "wishlist" | "cart" | "account" | "login" | "register"
  const [currentPage, setCurrentPage] = useState<string>("home");
  
  // Dynamic spreadsheet product catalogue state
  const [products, setProducts] = useState<Product[]>(CHERI_PRODUCTS);

  // Load products dynamically from spreadsheet API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("API load status failing");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic products, using fallback static catalog", err);
      });
  }, []);
  
  // Authentication & Membership Persistence
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("cheri_is_logged_in") === "true";
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem("cheri_registered_users");
    if (saved) return JSON.parse(saved);
    const defaults = [
      {
        email: "contact.cheri@gmail.com",
        password: "cheri123",
        name: "Nguyễn Thơ",
        phone: "0881 1880 080",
        address: "118 Linh Trung, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh",
        memberTier: "Gold",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        orders: DEFAULT_USER.orders
      },
      {
        email: "test@gmail.com",
        password: "123",
        name: "Huyền My",
        phone: "0909 123 456",
        address: "79 Đường 3/2, Quận 10, Thành phố Hồ Chí Minh",
        memberTier: "Silver",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        orders: []
      }
    ];
    localStorage.setItem("cheri_registered_users", JSON.stringify(defaults));
    return defaults;
  });

  // App States with LocalStorage Hydration
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cheri_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("cheri_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("cheri_user");
    const isLogged = localStorage.getItem("cheri_is_logged_in") === "true";
    if (isLogged && saved) {
      return JSON.parse(saved);
    }
    return GUEST_USER;
  });

  // Category & Filters States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");

  // Interaction States
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [headerSearchInput, setHeaderSearchInput] = useState<string>("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Detailed Modal Selectors
  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>({ name: "", hex: "" });
  const [selectedClassification, setSelectedClassification] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");

  // Toast Notification System
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  // Login form local states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form local states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regSelectedAvatar, setRegSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Profile password modification local states
  const [accPassword, setAccPassword] = useState("");
  const [accConfirmPassword, setAccConfirmPassword] = useState("");

  // Checkout Form State
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutPayment, setCheckoutPayment] = useState("bank_transfer");

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem("cheri_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("cheri_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cheri_user", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("cheri_is_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // Set checkout defaults once profile is loaded
  useEffect(() => {
    if (isLoggedIn) {
      setCheckoutName(userProfile.name);
      setCheckoutPhone(userProfile.phone);
      setCheckoutAddress(userProfile.address);
    } else {
      setCheckoutName("");
      setCheckoutPhone("");
      setCheckoutAddress("");
    }
  }, [userProfile, isLoggedIn]);

  // Toast auto-dismisser helper
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Quick action: Add immediately to cart using first size/color/classification
  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    const defaultClassification = (product as any).classifications && (product as any).classifications.length > 0 ? (product as any).classifications[0] : undefined;
    
    // Check if duplicate already in cart
    const existingIndex = cart.findIndex(
      item => 
        item.product.id === product.id && 
        item.size === defaultSize && 
        item.color?.hex === defaultColor?.hex &&
        item.classification === defaultClassification
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        product,
        size: defaultSize,
        color: defaultColor,
        classification: defaultClassification,
        quantity: 1
      };
      setCart([...cart, newItem]);
    }
    const sizeText = defaultSize ? ` (Size ${defaultSize})` : '';
    showToast(`Đã thêm sản phẩm vào Giỏ Hàng${sizeText} ✨`);
  };

  // Toggle favorite state
  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast("Đã bỏ thích sản phẩm 🤍", "info");
    } else {
      setWishlist([...wishlist, productId]);
      showToast("Đã lưu vào danh mục Thích của quý cô 🌹");
    }
  };

  // Remove directly from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng", "info");
  };

  // Adjust item quantities
  const handleUpdateQuantity = (itemId: string, increment: boolean) => {
    const updated = cart.map(item => {
      if (item.id === itemId) {
        const newQty = increment ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCart(updated);
  };

  // Trigger Detail Focus View Modal
  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "");
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
    setSelectedClassification((product as any).classifications && (product as any).classifications.length > 0 ? (product as any).classifications[0] : "");
    setPreviewImage(product.image);
  };

  // Add customized item from quick view modal
  const handleAddFromModal = () => {
    if (!quickViewProduct) return;
    
    const existingIndex = cart.findIndex(
      item => 
        item.product.id === quickViewProduct.id && 
        (!quickViewProduct.sizes || quickViewProduct.sizes.length === 0 || item.size === selectedSize) && 
        (!quickViewProduct.colors || quickViewProduct.colors.length === 0 || (item.color && selectedColor && item.color.hex === selectedColor.hex)) &&
        (!(quickViewProduct as any).classifications || (quickViewProduct as any).classifications.length === 0 || item.classification === selectedClassification)
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${quickViewProduct.id}-${Date.now()}`,
        product: quickViewProduct,
        size: quickViewProduct.sizes && quickViewProduct.sizes.length > 0 ? selectedSize : undefined,
        color: quickViewProduct.colors && quickViewProduct.colors.length > 0 ? (selectedColor || undefined) : undefined,
        classification: (quickViewProduct as any).classifications && (quickViewProduct as any).classifications.length > 0 ? selectedClassification : undefined,
        quantity: 1
      };
      setCart([...cart, newItem]);
    }
    setQuickViewProduct(null);
    showToast(`Đã thêm ${quickViewProduct.name} vào giỏ hàng thành công ✨`);
  };

  // Coupon code applier simulation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.toUpperCase().trim();
    if (code === "CHERIVIP") {
      setAppliedDiscount({ code: "CHERIVIP", percent: 10 });
      showToast("Áp dụng mã quý tộc CHERIVIP thành công! Giảm giá 10% ⚜️");
    } else if (code === "SLOWFASHION") {
      setAppliedDiscount({ code: "SLOWFASHION", percent: 15 });
      showToast("Áp dụng mã SLOWFASHION thành công! Giảm giá 15% 🌱");
    } else {
      showToast("Mã chiết khấu không tồn tại hoặc đã hết hạn", "info");
    }
    setPromoCode("");
  };

  // Simulate complete checkout order process
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!isLoggedIn) {
      showToast("Quý cô xin vui lòng Đăng nhập hoặc Đăng ký thành viên Chéri để đặt hàng nhé! ✨", "info");
      setCurrentPage("login");
      return;
    }

    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
      showToast("Xin vui lòng điền đầy đủ thông tin giao nhận", "info");
      return;
    }

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name + (item.classification ? ` [${item.classification}]` : ""),
      price: item.product.price,
      quantity: item.quantity,
      size: item.size || "",
      colorName: item.color?.name || ""
    }));

    const finalTotal = totalCalculated.final;

    const newOrder: Order = {
      id: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      total: finalTotal,
      status: "pending",
      statusText: "Đang xử lý chuẩn bị",
      address: checkoutAddress,
      phone: checkoutPhone
    };

    // Update user historic logs
    const updatedProfile: UserProfile = {
      ...userProfile,
      name: checkoutName,
      address: checkoutAddress,
      phone: checkoutPhone,
      orders: [newOrder, ...userProfile.orders]
    };

    setUserProfile(updatedProfile);

    // Sync into registeredUsers list
    const updatedUsers = registeredUsers.map(u => {
      if (u.email.toLowerCase() === userProfile.email.toLowerCase()) {
        return {
          ...u,
          name: checkoutName,
          address: checkoutAddress,
          phone: checkoutPhone,
          orders: [newOrder, ...u.orders]
        };
      }
      return u;
    });
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("cheri_registered_users", JSON.stringify(updatedUsers));

    setCart([]); // Clean cart
    setAppliedDiscount(null);
    showToast("Chúc mừng Quý cô! Đơn hàng Chéri tinh tuyển của chị đã được tạo thành công 🌹");
    setCurrentPage("account"); // Route to order tracking logs
  };

  // Profile data updating handler
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (accPassword && accPassword !== accConfirmPassword) {
      showToast("Xác nhận mật khẩu mới không khớp 🌹", "info");
      return;
    }

    // Save back to registry list
    const updatedUsers = registeredUsers.map(u => {
      if (u.email.toLowerCase() === userProfile.email.toLowerCase()) {
        return {
          ...u,
          name: userProfile.name,
          phone: userProfile.phone,
          address: userProfile.address,
          avatar: userProfile.avatar,
          password: accPassword ? accPassword : u.password
        };
      }
      return u;
    });

    setRegisteredUsers(updatedUsers);
    localStorage.setItem("cheri_registered_users", JSON.stringify(updatedUsers));

    // Reset fields
    setAccPassword("");
    setAccConfirmPassword("");
    
    showToast("Cập nhật thông tin địa chỉ cá nhân và mật mã thành công! ✨");
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryEmail = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    const match = registeredUsers.find(u => u.email.toLowerCase() === queryEmail && u.password === password);
    if (match) {
      setIsLoggedIn(true);
      setUserProfile({
        name: match.name,
        email: match.email,
        phone: match.phone,
        address: match.address,
        memberTier: match.memberTier || "Bronze",
        avatar: match.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        orders: match.orders || []
      });
      showToast(`Chào mừng Quý cô ${match.name} quay lại với Chéri! ✨`);
      setCurrentPage("home");
      setLoginEmail("");
      setLoginPassword("");
    } else {
      const userExists = registeredUsers.some(u => u.email.toLowerCase() === queryEmail);
      if (userExists) {
        showToast("Mật khẩu không chính xác. Quý cô vui lòng kiểm tra lại 🌹", "info");
      } else {
        showToast("Tài khoản chưa tồn tại. Quý cô vui lòng Đăng ký nhé! ✨", "info");
      }
    }
  };

  // Register handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim();
    const phone = regPhone.trim();
    const address = regAddress.trim();
    const password = regPassword;
    const confirmPass = regConfirmPassword;

    if (!name || !email || !phone || !address || !password) {
      showToast("Vui lòng điện đầy đủ thông tin để hoàn tất đăng ký ✨", "info");
      return;
    }

    if (password !== confirmPass) {
      showToast("Xác nhận mật khẩu không khớp 🌹", "info");
      return;
    }

    const exists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast("Email này đã được sử dụng. Quý cô vui lòng Đăng nhập nhé! ⚜️", "info");
      return;
    }

    const newUser = {
      name,
      email,
      phone,
      address,
      password,
      memberTier: "Bronze",
      avatar: regSelectedAvatar,
      orders: []
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("cheri_registered_users", JSON.stringify(updatedUsers));

    setIsLoggedIn(true);
    setUserProfile({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      memberTier: "Bronze",
      avatar: newUser.avatar,
      orders: []
    });

    showToast("Đăng ký thành viên Chéri thành công! Chào mừng Quý cô 🌹");
    setCurrentPage("account");

    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegAddress("");
    setRegPassword("");
    setRegConfirmPassword("");
  };

  // Unified filter lookup for search and category selections
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, products]);

  // Unified totals calculation
  const totalCalculated = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const promoDiscountAmount = appliedDiscount ? Math.round(subtotal * (appliedDiscount.percent / 100)) : 0;
    const preTax = subtotal - promoDiscountAmount;
    const tax = Math.round(preTax * 0.08); // VAT 8% in Vietnam
    
    // Free delivery for orders above 1.500.000đ, otherwise 30.000đ standard luxury boxing
    const shipping = (subtotal === 0 || subtotal >= 1500000) ? 0 : 30000;
    const final = preTax + tax + shipping;

    return {
      subtotal,
      discount: promoDiscountAmount,
      tax,
      shipping,
      final
    };
  }, [cart, appliedDiscount]);

  // Quick action for global search popup
  const handleTriggerHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(headerSearchInput);
    setIsSearchOpen(false);
    setHeaderSearchInput("");
    setCurrentPage("products");
  };

  // Helper formatting numbers for currency VND
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between selection:bg-[#74070e]/10 selection:text-[#74070e]">
      
      {/* Dynamic Header */}
      <Header 
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === "account" && !isLoggedIn) {
            setCurrentPage("login");
            showToast("Quý cô xin vui lòng Đăng nhập để trải nghiệm đặc quyền hội viên nhé! ✨", "info");
          } else {
            setCurrentPage(page);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userProfile.name}
        userAvatar={userProfile.avatar}
      />

      {/* Global Toast Notify Indicator */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="bg-[#74070e] text-white text-xs uppercase tracking-widest font-light py-3 px-6 rounded-full shadow-2xl flex items-center space-x-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Primary Layout Pages */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {currentPage === "home" && (
          <div className="animate-fade-in">
            {/* Elegant Hero Banner */}
            <section className="relative h-[650px] bg-[#FCFBF9] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600" 
                  alt="Minimal luxury portrait Banner" 
                  className="w-full h-full object-cover opacity-15 grayscale-[50%] scale-105"
                />
              </div>
              <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 max-w-lg">
                  <span className="text-[11px] uppercase tracking-[0.4em] font-light text-[#74070e] block">Chéri - Gentle Elegance</span>
                  <h1 className="text-4xl sm:text-6xl font-serif text-gray-900 tracking-tight leading-tight">
                    Tối Giản Bản Lĩnh, <span className="font-light italic text-[#74070e] block mt-2">Nâng Niu Bản Sắc.</span>
                  </h1>
                  <p className="text-sm font-light text-gray-500 leading-relaxed tracking-wide">
                    Hòa tấu dịu dàng từ sợi tơ tằm Mulberry bồng bềnh tự nhiên và dòng satin Ý chảy tràn trên làn da. Chéri nâng niu trọn vẹn nét thanh tao kiêu hãnh của Quý cô đương đại.
                  </p>
                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setCurrentPage("products");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border border-[#74070e] text-[#74070e] hover:bg-[#74070e] hover:text-white text-[11px] uppercase tracking-[0.2em] font-light px-8 py-4 rounded-none transition-all duration-300 flex items-center space-x-2 cursor-pointer bg-white"
                    >
                      <span>Khám phá Bộ sưu tập</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage("about")}
                      className="border border-[#74070e]/20 hover:border-[#74070e] text-[#74070e] text-[11px] uppercase tracking-[0.2em] font-light px-8 py-4 rounded-none transition-all duration-300 cursor-pointer bg-white"
                    >
                      Tìm hiểu triết lý
                    </button>
                  </div>
                </div>

                <div className="hidden lg:block relative">
                  <div className="relative w-[420px] h-[520px] mx-auto z-10 rounded-none overflow-hidden border border-[#74070e]/10">
                    <img 
                      src="https://images.unsplash.com/photo-1548624149-f95ab51fc05b?auto=format&fit=crop&q=80&w=800" 
                      alt="Chéri Silk Garment" 
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-700 whitespace-nowrap"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-[#FCFBF9] border border-[#74070e]/10 p-5 rounded-none z-20 space-y-1.5 max-w-[200px]">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#74070e]">Chất Liệu Nữ Vương</span>
                    <p className="text-[11px] font-light text-gray-500">100% Sợi Tơ tằm Mulberry dệt nổi Pháp mịn óng mát.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Triết lý Quote Section: Minimal Block */}
            <section className="py-20 bg-white border-b border-gray-50">
              <div className="max-w-4xl mx-auto text-center px-6 space-y-5">
                <Sparkles className="w-5 h-5 text-[#74070e] mx-auto animate-pulse" />
                <h2 className="text-xl uppercase tracking-[0.2em] font-serif text-[#74070e]">Gentle Elegance</h2>
                <blockquote className="text-xl sm:text-2xl font-serif text-gray-800 italic leading-relaxed font-light">
                  "Thời trang Chéri là sự giản lược mọi chi tiết nặng nề để trả lại hào quang tinh khiết cho phái nữ. Vẻ thanh lịch tối thượng không phải để bất thình lình gây chú ý, mà để đọng lại ấm áp dịu dàng sâu xa trong tim người đối diện."
                </blockquote>
                <div className="h-0.5 w-16 bg-[#74070e]/20 mx-auto mt-6"></div>
              </div>
            </section>

            {/* Featured Best Sellers Grid */}
            <section className="py-20 max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-5">
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-serif tracking-tight text-gray-900">Sản phẩm tiêu biểu</h3>
                  <p className="text-xs font-light text-gray-400 uppercase tracking-widest">Tuyển tập những mẫu đầm lụa cát dầy dặn và blazer tinh khôi bán chạy nhất</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage("products");
                  }}
                  className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-normal text-[#74070e] hover:text-[#5a050a] flex items-center space-x-1 border-b border-[#74070e] pb-1 cursor-point"
                >
                  <span>Xem Toàn Bộ Cửa Hàng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map((product) => {
                  const isFav = wishlist.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => openQuickView(product)}
                      className="group cursor-pointer flex flex-col space-y-3 relative"
                    >
                      {/* Product Image Stage */}
                      <div className="relative aspect-[3/4] bg-[#FCFBF9] overflow-hidden rounded-none border border-[#74070e]/5">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        {/* Status Label badge */}
                        {!product.inStock ? (
                          <span className="absolute top-3 left-3 bg-[#74070e]/85 text-white text-[8px] font-semibold uppercase tracking-[0.2em] py-1 px-2.5 rounded-none z-10">
                            HẾT HÀNG
                          </span>
                        ) : product.isNew ? (
                          <span className="absolute top-3 left-3 bg-[#74070e] text-white text-[8px] font-normal uppercase tracking-[0.2em] py-1 px-2.5 rounded-none z-10">
                            NEW
                          </span>
                        ) : null}
                        {product.originalPrice && product.inStock && (
                          <span className="absolute top-3 right-3 bg-stone-700 text-white text-[8px] font-normal uppercase tracking-[0.2em] py-1 px-2.5 rounded-none z-10">
                            ƯU ĐÃI
                          </span>
                        )}

                        {/* Hover Overlay triggers */}
                        <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openQuickView(product);
                            }}
                            className="bg-white hover:bg-[#74070e] hover:text-white text-[#74070e] p-2.5 rounded-full border border-[#74070e]/10 transition-all scale-95 group-hover:scale-100 cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {product.inStock && (
                            <button
                              onClick={(e) => handleQuickAddToCart(product, e)}
                              className="bg-[#74070e] text-white p-2.5 rounded-full border border-[#74070e] hover:opacity-80 transition-all scale-95 group-hover:scale-100 cursor-pointer"
                              title="Thêm nhanh vào giỏ"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Favorite Heart Trigger */}
                        <button
                          onClick={(e) => handleToggleWishlist(product.id, e)}
                          className="absolute bottom-3 right-3 bg-white hover:bg-white/90 p-2 rounded-full border border-[#74070e]/10 z-10 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-[#74070e] text-[#74070e]" : "text-[#74070e]/40"}`} />
                        </button>
                      </div>

                      {/* Info block */}
                      <div className="space-y-1 pr-1 text-center sm:text-left">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-light">{product.categoryName}</span>
                        <h4 className="text-sm font-light text-gray-800 group-hover:text-[#74070e] transition-colors line-clamp-1">{product.name}</h4>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-xs font-semibold text-[#74070e]">{formatVND(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">{formatVND(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Split promotional gallery */}
            <section className="grid grid-cols-1 md:grid-cols-2 bg-[#FAF8F5]">
              <div className="py-20 px-8 sm:px-16 flex flex-col justify-center space-y-6 max-w-xl mx-auto">
                <span className="text-[10px] text-[#74070e] uppercase tracking-[0.3em] font-semibold">Bán lẻ Cao cấp</span>
                <h3 className="text-2xl sm:text-4xl font-serif text-gray-900 leading-snug font-normal">
                  Nghệ thuật may mặc bền bỉ trường tồn cùng <span className="italic font-light">Thời gian.</span>
                </h3>
                <p className="text-sm font-light text-gray-500 leading-relaxed">
                  Tại Chéri, từng nếp xếp ly satin hay phom dáng blazer đều trải qua hàng giờ nghiên cứu định hình cấu trúc đứng đan sợi. Chúng tôi tôn trọng nguyên bản vải mộc hữu cơ, hướng về khái niệm thời trang chậm đầy nâng niu.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-xs text-gray-700 font-light">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#74070e]">✓</div>
                    <span>Dịch vụ đo may viền mác thủ công tinh diệu.</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-700 font-light">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#74070e]">✓</div>
                    <span>Sử dụng cúc ngọc trai xà cừ đại vương từ tự nhiên vỏ trai biển sâu.</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-700 font-light">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#74070e]">✓</div>
                    <span>Kỹ thuật rập dập ly thủ công dập nhiệt khóa bền vĩnh viễn.</span>
                  </div>
                </div>
              </div>
              <div className="relative h-[450px] md:h-auto min-h-[350px]">
                <img 
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800" 
                  alt="Chéri Satin evening fabric dress detail" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Chéri Journal Blog Summary */}
            <section className="py-20 max-w-7xl mx-auto px-6 sm:px-12 space-y-12 bg-white">
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#74070e] font-semibold">Tản văn Phong cách</span>
                <h3 className="text-2xl sm:text-3xl font-serif text-gray-800">Chéri Journal</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto font-light">Lắng nghe chia sẻ của nhà thiết kế Chéri về nghệ thuật phối đồ tinh tế tối giản</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {BLOGS.map((blog) => (
                  <div key={blog.id} className="group cursor-pointer space-y-4">
                    <div className="aspect-[16/9] rounded-none overflow-hidden bg-[#FCFBF9] border border-[#74070e]/5">
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-2 pr-2">
                      <span className="text-[10px] text-gray-400 tracking-wider font-mono uppercase">{blog.date}</span>
                      <h4 className="text-lg font-serif text-gray-800 group-hover:text-[#74070e] transition-colors">{blog.title}</h4>
                      <p className="text-xs font-light text-gray-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                      <span className="inline-block text-xs text-[#74070e] border-b border-[#74070e]/40 pb-0.5 group-hover:border-[#74070e] transition-all font-light pt-1 uppercase tracking-widest">Đọc câu chuyện</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCTS CATALOGUE */}
        {currentPage === "products" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 animate-fade-in space-y-8">

            {/* Category selection and sorting toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between border-y border-gray-100 py-6 gap-4">
              {/* Categories Row */}
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
                {CHERI_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery("");
                    }}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-light transition-all rounded-none border cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-[#74070e] text-white border-[#74070e]"
                        : "bg-white text-gray-600 border-[#74070e]/10 hover:border-[#74070e] hover:text-[#74070e]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* In-page active search status & Sort Selector */}
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-4">
                {searchQuery && (
                  <span className="text-xs text-gray-500 font-light">
                    Tìm kiếm cho: "<strong className="text-[#74070e]">{searchQuery}</strong>" 
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="ml-2 text-gray-400 hover:text-[#74070e] cursor-pointer"
                    >
                      (Xóa)
                    </button>
                  </span>
                )}
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#74070e]/15 text-[10px] uppercase tracking-[0.15em] px-4 py-3 rounded-none outline-none text-[#74070e] hover:border-[#74070e] cursor-pointer"
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="price_asc">Giá tăng dần 💎</option>
                  <option value="price_desc">Giá giảm dần 💎</option>
                  <option value="rating">Được thích nhiều nhất 🌹</option>
                </select>
              </div>
            </div>

            {/* Grid listings of filtered items */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => {
                  const isFav = wishlist.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => openQuickView(product)}
                      className="group cursor-pointer flex flex-col space-y-3"
                    >
                      {/* Product Image Stage */}
                      <div className="relative aspect-[3/4] bg-[#FCFBF9] overflow-hidden rounded-none border border-[#74070e]/5">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        {/* Status Label badge */}
                        {!product.inStock ? (
                          <span className="absolute top-3 left-3 bg-[#74070e]/85 text-white text-[8px] font-semibold uppercase tracking-[0.2em] py-1 px-2.5 rounded-none z-10">
                            HẾT HÀNG
                          </span>
                        ) : product.isNew ? (
                          <span className="absolute top-3 left-3 bg-[#74070e] text-white text-[8px] font-normal uppercase tracking-[0.2em] py-1 px-2.5 rounded-none z-10">
                            NEW
                          </span>
                        ) : null}
                        {product.originalPrice && product.inStock && (
                          <span className="absolute top-3 right-3 bg-stone-700 text-white text-[8px] font-normal uppercase tracking-[0.2em] py-1 px-2.5 rounded-none z-10">
                            OFFER
                          </span>
                        )}

                        {/* Hover Overlay triggers */}
                        <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openQuickView(product);
                            }}
                            className="bg-white hover:bg-[#74070e] hover:text-white text-[#74070e] p-2.5 rounded-full border border-[#74070e]/10 transition-all scale-95 group-hover:scale-100 cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {product.inStock && (
                            <button
                              onClick={(e) => handleQuickAddToCart(product, e)}
                              className="bg-[#74070e] text-white p-2.5 rounded-full border border-[#74070e] hover:opacity-80 transition-all scale-95 group-hover:scale-100 cursor-pointer"
                              title="Thêm nhanh vào giỏ"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Favorite Heart Trigger */}
                        <button
                          onClick={(e) => handleToggleWishlist(product.id, e)}
                          className="absolute bottom-3 right-3 bg-white hover:bg-white/90 p-2 rounded-full border border-[#74070e]/10 z-10 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-[#74070e] text-[#74070e]" : "text-[#74070e]/40"}`} />
                        </button>
                      </div>

                      {/* Info block */}
                      <div className="space-y-1 text-center sm:text-left pr-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-light">{product.categoryName}</span>
                        <h4 className="text-sm font-light text-gray-800 group-hover:text-[#74070e] transition-colors line-clamp-1">{product.name}</h4>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-xs font-semibold text-[#74070e]">{formatVND(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">{formatVND(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#FAF8F5] border border-dashed border-gray-200 rounded-2xl max-w-2xl mx-auto space-y-4">
                <Heart className="w-8 h-8 text-gray-300 mx-auto" />
                <h3 className="text-lg font-serif">Chưa Tìm Thấy Thiết Kế Thiết Bản</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">Chéri chưa tìm thấy sản phẩm nào khớp với bộ lọc kiếm tìm của chị. Chị có thể xóa từ khóa hoặc thử lại với danh mục khác nhé.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="bg-[#74070e] hover:bg-[#5a050a] text-white text-[10px] uppercase tracking-widest font-light py-2 px-6 rounded-full cursor-pointer"
                >
                  Xem Toàn Bộ Sản Phẩm
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: ABOUT INTRO EDITORIAL */}
        {currentPage === "about" && (
          <div className="animate-fade-in max-w-6xl mx-auto px-6 py-16 space-y-24">
            
            {/* SECTION 1 — CÂU CHUYỆN THƯƠNG HIỆU */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left column: candid luxury fashion image */}
              <div className="lg:col-span-12 xl:col-span-5 relative">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-none border border-[#74070e]/15 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" 
                    alt="Chéri Candid Luxury Fashion"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-[0.98] hover:scale-102 hover:grayscale-0 transition-all duration-750 select-none animate-fade-in"
                  />
                  <div className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] text-white/75 bg-[#74070e]/80 py-1.5 px-3 backdrop-blur-xs font-light">
                    Chéri Editorial © 2026
                  </div>
                </div>
              </div>

              {/* Right column: editorial text style */}
              <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center space-y-6 lg:pl-6">
                <span className="text-[11px] tracking-[0.3em] font-sans uppercase text-[#74070e] font-semibold">OUR STORY</span>
                
                <h3 className="text-2.5xl sm:text-4xl font-serif text-[#74070e] leading-snug tracking-tight font-light select-none">
                  “Thời trang không chỉ để mặc — mà để kể câu chuyện của chính mình.”
                </h3>
                
                <div className="space-y-4 text-stone-600 font-light text-[14px] leading-relaxed text-justify font-sans">
                  <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-[#74070e] first-letter:mr-3 first-letter:float-left first-letter:font-normal first-letter:leading-none">
                    Ra đời giữa lòng dòng chảy thời trang đương đại, Chéri tự hào là chốn dừng chân tôn vinh vẻ đẹp riêng biệt của phụ nữ Việt – nơi bản ngã thanh lịch được lắng nghe và nuôi dưỡng ngọt ngào. Chúng tôi tin rằng, mỗi người phụ nữ là một tác phẩm nghệ thuật độc bản, mang trong mình nét mềm mại nguyên bản cùng hơi thở hiện đại, tự tin đầy cuốn hút.
                  </p>
                  <p>
                    Không chạy theo những xu hướng vội vã chóng vánh, Chéri chọn con đường kiến tạo giá trị duyên dáng lâu bền thông qua ngôn ngữ tối giản cao cấp. Từng chất liệu tơ tằm nguyên bản lý tưởng kết hợp cùng nét cắt may đương đại chuẩn xác nhằm nâng niu trọn vẹn cả vóc dáng lẫn cảm xúc lãng mạn bên trong quý cô. Hãy để Chéri cùng phác họa nên những trang ký ức đầy thi vị và kiêu hãnh bước đi cùng hành trình riêng của bạn.
                  </p>
                </div>

                {/* Thin cherry red line */}
                <div className="h-[1px] w-full bg-[#74070e]/20 mt-4"></div>

                <div className="pt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="relative inline-block select-none">
                      <span className="font-serif italic text-3xl font-light text-[#74070e] tracking-wide">Nguyễn Thơ</span>
                      {/* Fake founder signature path */}
                      <svg className="absolute -bottom-1 -left-1 w-36 h-8 text-[#74070e]/25 pointer-events-none stroke-[1.2]" viewBox="0 0 100 30" fill="none" stroke="currentColor">
                        <path d="M5 22 Q25 4 45 16 T80 8 T95 18 C100 8 102 24 105 15" />
                      </svg>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#74070e]/60 font-sans font-semibold">Founder of Chéri</p>
                  </div>
                  
                  <div className="flex flex-col items-end text-right space-y-1.5">
                    <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#74070e]/80">Est. 2026</span>
                    <div className="w-16 h-[1.5px] bg-[#74070e]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 — TẦM NHÌN & SỨ MỆNH */}
            <div className="bg-[#F7F3F3] -mx-6 sm:-mx-12 px-6 sm:px-16 py-16 sm:py-24 space-y-16">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#74070e] font-sans font-medium">ABOUT CHÉRI</span>
                <h2 className="text-3xl font-serif text-[#74070e] tracking-wider uppercase font-light">TẦM NHÌN & SỨ MỆNH</h2>
                <div className="h-[1px] w-12 bg-[#74070e]/35 mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
                {/* TẦM NHÌN CARD */}
                <div className="bg-white p-12 sm:p-16 border border-[#74070e]/5 rounded-none shadow-none hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between space-y-10 group cursor-default">
                  <div className="space-y-8">
                    {/* Minimal line art icon */}
                    <div className="w-14 h-14 bg-[#74070e]/5 flex items-center justify-center border border-[#74070e]/10 text-[#74070e] transition-colors duration-300 group-hover:bg-[#74070e] group-hover:text-white">
                      <svg className="w-6 h-6 stroke-[1]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2A15.3 15.3 0 0 1 16 12A15.3 15.3 0 0 1 12 22A15.3 15.3 0 0 1 8 12A15.3 15.3 0 0 1 12 2z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-serif text-[#74070e] tracking-wide font-normal uppercase">TẦM NHÌN</h3>
                    
                    <p className="text-[16px] sm:text-[18px] leading-relaxed text-stone-800 font-serif italic font-light">
                      “Xây dựng thương hiệu thời trang Việt Nam vươn tầm khu vực, nơi gặp gỡ của sự tinh tế thế giới.”
                    </p>
                  </div>
                  
                  <div className="border-t border-[#74070e]/10 pt-6 text-[9px] tracking-[0.25em] uppercase text-[#74070e]/50 font-mono font-light">
                    CHÉRI VISIONARY BLUEPRINT
                  </div>
                </div>

                {/* SỨ MỆNH CARD */}
                <div className="bg-white p-12 sm:p-16 border border-[#74070e]/5 rounded-none shadow-none hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between space-y-10 group cursor-default">
                  <div className="space-y-8">
                    {/* Feminine botanical line art icon (Large spacing, premium layout) */}
                    <div className="w-14 h-14 bg-[#74070e]/5 flex items-center justify-center border border-[#74070e]/10 text-[#74070e] transition-colors duration-300 group-hover:bg-[#74070e] group-hover:text-white">
                      <svg className="w-6 h-6 stroke-[1]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 22C12 22 12 11 12 8C12 5 13.5 3 16 3C16 3 17 5 15 8C13 11 12 22 12 22Z" />
                        <path d="M12 22C12 22 12 11 12 8C12 5 10.5 3 8 3C8 3 7 5 9 8C11 11 12 22 12 22Z" />
                        <path d="M12 13C15 13 18 15 19 18" />
                        <path d="M12 15C9 15 6 17 5 20" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-serif text-[#74070e] tracking-wide font-normal uppercase">SỨ MỆNH</h3>
                    
                    <p className="text-[15px] sm:text-[16px] leading-relaxed text-stone-600 font-sans font-light select-none">
                      “Chéri cam kết đồng hành cùng mọi cô gái, bất kể hình thể hay vóc dáng, trên hành trình nuôi dưỡng sự tự tin và tỏa sáng theo cách riêng của mình.”
                    </p>
                  </div>
                  
                  <div className="border-t border-[#74070e]/10 pt-6 text-[9px] tracking-[0.25em] uppercase text-[#74070e]/50 font-mono font-light">
                    OUR ULTIMATE MISSION
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3 — GIÁ TRỊ THƯƠNG HIỆU */}
            <div className="space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[11px] tracking-[0.3em] font-sans uppercase text-[#74070e] font-semibold">GIÁ TRỊ CỐT LÕI</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#74070e] tracking-wider font-light">GIÁ TRỊ THƯƠNG HIỆU</h2>
                <div className="h-[1px] w-12 bg-[#74070e]/35 mx-auto mt-4"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                  {
                    num: "01",
                    tag: "Feminine Elegance",
                    title: "Feminine Elegance",
                    desc: "Vẻ đẹp bay bổng mềm mại khơi nguồn cảm xúc đầy chất thơ xao xuyến, tôn vinh nét lãng mạn lướt mát mềm mại bên ngoài vóc dáng kiêu sa của quý cô.",
                    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
                  },
                  {
                    num: "02",
                    tag: "Confidence",
                    title: "Confidence",
                    desc: "Nét căt may dứt khoát đương đại đi cùng kết cấu tinh xảo, thầm nói lên sự tự tôn kiêu hãnh và quyền năng quyến rũ vẹn nguyên trong từng hoàn cảnh ứng dụng.",
                    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600"
                  },
                  {
                    num: "03",
                    tag: "Minimal Luxury",
                    title: "Minimal Luxury",
                    desc: "Sự sang trọng thầm lặng đỉnh cao của tinh thần tối giản tinh tường, không cầu kỳ phô diễn bề thế phô trương mà mộc mạc lưu lại ấn tượng sâu đậm thanh nhã.",
                    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=600"
                  },
                  {
                    num: "04",
                    tag: "Authentic Beauty",
                    title: "Authentic Beauty",
                    desc: "Sự thấu hiểu và trân trọng hình thể nguyên sinh bất chấp mọi định kiến vóc dáng, truyền cảm hứng phát huy thần thái mộc mạc nguyên sơ tiềm ẩn bên trong.",
                    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600"
                  }
                ].map((val) => (
                  <div 
                    key={val.num}
                    className="flex flex-col sm:flex-row items-stretch border border-[#74070e]/10 bg-white overflow-hidden relative group transition-all duration-500 hover:bg-[#74070e]/[0.03] hover:border-[#74070e]/30 rounded-none shadow-none cursor-default"
                  >
                    {/* Column 1: Image with subtle monochrome grayscale and zoom */}
                    <div className="w-full sm:w-[150px] md:w-[180px] shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden relative border-b sm:border-b-0 sm:border-r border-[#74070e]/10">
                      <img 
                        src={val.image} 
                        alt={val.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0 select-none"
                      />
                    </div>
                    {/* Column 2: Details */}
                    <div className="p-8 flex flex-col justify-center space-y-2 relative overflow-hidden flex-1">
                      {/* Big sequence number faded behind - blurry/transparent editorial effect */}
                      <span className="absolute right-4 bottom-1 text-[#74070e]/5 text-9xl font-serif select-none pointer-events-none group-hover:text-[#74070e]/10 transition-colors duration-500 italic">
                        {val.num}
                      </span>
                      <span className="text-[9px] tracking-[0.25em] uppercase text-[#74070e]/60 font-sans block relative z-10 font-bold">
                        {val.tag}
                      </span>
                      <h3 className="text-[15px] font-serif text-[#74070e] font-normal tracking-wider relative z-10 uppercase transition-all duration-300">
                        {val.title}
                      </h3>
                      <p className="text-[12.5px] text-stone-500 font-light leading-relaxed max-w-sm relative z-10 text-justify">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 4: WISHLIST / FAVORITE DIRECTORY */}
        {currentPage === "wishlist" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 animate-fade-in space-y-8">
            <div className="text-center space-y-1.5">
              <h2 className="text-3xl font-serif text-gray-950">Danh mục yêu thích</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-light">Ước nguyện thời trang của Quý cô thầm lưu giữ</p>
              <div className="h-0.5 w-16 bg-[#74070e]/20 mx-auto mt-2.5"></div>
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.filter(p => wishlist.includes(p.id)).map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => openQuickView(product)}
                    className="group cursor-pointer flex flex-col space-y-3 relative"
                  >
                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-xl">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCart(product.id); // Simulating remove favorit
                          setWishlist(wishlist.filter(id => id !== product.id));
                          showToast("Đã bỏ thích sản phẩm", "info");
                        }}
                        className="absolute top-3 right-3 bg-white hover:bg-red-50 p-2 rounded-full text-red-700 shadow-md z-10"
                        title="Bỏ thích"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-[#74070e] text-white text-[10px] uppercase tracking-widest font-normal py-2 px-6 rounded-full shadow-lg">
                          Xem Chi Tiết Mẫu
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[10px] text-gray-400 tracking-wider uppercase font-light">{product.categoryName}</span>
                      <h4 className="text-sm text-gray-800 font-light group-hover:text-[#74070e] transition-colors">{product.name}</h4>
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <span className="text-xs font-semibold text-[#74070e]">{formatVND(product.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#FCFBF9] rounded-2xl border border-gray-100 max-w-lg mx-auto space-y-5">
                <Heart className="w-10 h-10 text-gray-300 mx-auto stroke-1" />
                <h3 className="text-lg font-serif">Chưa lưu giữ thiết kế mộng mơ nào</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto font-light leading-relaxed">Khi Quý cô rung động trước chiếc Áo Mulberry lụa mướt hay Đầm Satin tinh tế, hãy bấm trái tim nhỏ để lưu giữ lại nơi đây nhé.</p>
                <button
                  onClick={() => setCurrentPage("products")}
                  className="bg-[#74070e] hover:bg-[#5a050a] text-white text-xs uppercase tracking-widest font-light py-3 px-8 rounded-full cursor-pointer"
                >
                  Ghé Thăm Cửa Hàng Chéri
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: CART & SIMULATED CHECKOUT */}
        {currentPage === "cart" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 border-b border-gray-100 pb-5 mb-8 text-center sm:text-left">
              Giỏ hàng thời thượng
            </h2>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Cart list (7 Columns) */}
                <div className="lg:col-span-7 space-y-6">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-6 gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-gray-800 limit-lines-1">{item.product.name}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 font-light">
                            {item.classification && (
                              <span>Phân loại: <strong className="text-gray-700 font-semibold">{item.classification}</strong></span>
                            )}
                            {item.size && (
                              <span>Size: <strong className="text-gray-700 font-semibold">{item.size}</strong></span>
                            )}
                            {item.color && (
                              <span className="flex items-center space-x-1">
                                <span>Màu:</span>
                                <span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.color.hex }}></span>
                                <strong className="text-gray-700 font-semibold">{item.color.name}</strong>
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#74070e] pt-1">{formatVND(item.product.price)}</p>
                        </div>
                      </div>

                      {/* Adjust quantity and actions */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-8 sm:space-x-12">
                        <div className="flex items-center border border-gray-200 rounded-full h-9 overflow-hidden">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, false)}
                            className="p-2 sm:px-3 text-gray-500 hover:bg-gray-50 hover:text-black cursor-pointer "
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, true)}
                            className="p-2 sm:px-3 text-gray-500 hover:bg-gray-50 hover:text-black cursor-pointer "
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right flex items-center space-x-4">
                          <span className="text-xs font-semibold text-gray-800 hidden sm:inline">{formatVND(item.product.price * item.quantity)}</span>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-1 px-1.5 rounded-full hover:bg-red-50 hover:text-red-700 text-gray-400 cursor-pointer"
                            title="Xóa khỏi giỏ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Trust factors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-[11px] text-gray-400 font-light uppercase tracking-wider text-center sm:text-left">
                    <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
                      <Truck className="w-5 h-5 text-[#74070e]/80" />
                      <span>BOXING VƯƠNG GIẢ TOÀN QUỐC</span>
                    </div>
                    <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
                      <RefreshCw className="w-4.5 h-4.5 text-[#74070e]/80" />
                      <span>7 NGÀY ĐỔI TRẢ UY TÍN CHÉ</span>
                    </div>
                    <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#74070e]/80" />
                      <span>BẢO HÀNH ĐƯỜNG MAY 6 THÁNG</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Panel (5 Columns) */}
                <div className="lg:col-span-5 bg-[#FCFBF9] border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-6">
                  <h3 className="text-lg font-serif text-gray-950 font-medium">Đối chiếu tóm tắt</h3>
                  
                  {/* Calculation sheet */}
                  <div className="space-y-3.5 text-xs font-light text-gray-600 border-b border-gray-200/80 pb-5">
                    <div className="flex justify-between">
                      <span>Cộng gốc ({cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                      <span className="text-gray-800 font-normal">{formatVND(totalCalculated.subtotal)}</span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Chiết khấu hoàng gia ({appliedDiscount.code} -{appliedDiscount.percent}%)</span>
                        <span>-{formatVND(totalCalculated.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Thuế giá trị phần trăm (VAT 8%)</span>
                      <span className="text-gray-800 font-normal">{formatVND(totalCalculated.tax)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Phí hộp vương giả & vận chuyển</span>
                      {totalCalculated.shipping === 0 ? (
                        <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[10px]">MIỄN PHÍ</span>
                      ) : (
                        <span className="text-gray-800 font-normal">{formatVND(totalCalculated.shipping)}</span>
                      )}
                    </div>
                    {totalCalculated.subtotal < 1500000 && (
                      <p className="text-[10px] text-gray-400 italic font-mono text-right">Mua thêm {formatVND(1500000 - totalCalculated.subtotal)} để được MIỄN PHÍ vận chuyển</p>
                    )}
                  </div>

                  {/* Final Total */}
                  <div className="flex justify-between items-center text-gray-900 border-b border-gray-200/80 pb-5">
                    <span className="text-sm tracking-wide">Tổng quý thanh toán</span>
                    <span className="text-xl font-semibold text-[#74070e] font-sans">{formatVND(totalCalculated.final)}</span>
                  </div>

                  {/* Coupon Area form */}
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Mã ưu đãi (Ví dụ: CHERIVIP)"
                      className="flex-1 bg-white border border-gray-200 rounded-lg text-xs px-3 py-2 outline-none text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-black text-white text-[10px] uppercase tracking-widest font-light px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </form>
                  <p className="text-[10px] text-gray-400 font-mono">* Thử mã <span className="text-[#74070e] font-semibold font-sans">CHERIVIP</span> (10% off) hoặc <span className="text-[#74070e] font-semibold font-sans">SLOWFASHION</span> (15% off)</p>

                  {/* Checkout Shipping form */}
                  <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2">
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-800 border-l-2 border-[#74070e] pl-2">Thông tin nhận hàng của Quý Cô</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Họ tên chị</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full bg-white border border-gray-100 focus:border-gray-200 outline-none text-xs px-3 py-2.5 rounded-lg text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Số điện thoại</label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full bg-white border border-gray-100 focus:border-gray-200 outline-none text-xs px-3 py-2.5 rounded-lg text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng</label>
                        <textarea
                          required
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-gray-100 focus:border-gray-200 outline-none text-xs px-3 py-2.5 rounded-lg text-gray-800 resize-none"
                        />
                      </div>

                      {/* Payment Choice */}
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Hình thức thanh toán</label>
                        <div className="space-y-2 text-xs">
                          <label className="flex items-center space-x-2.5 p-2.5 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-gray-200">
                            <input
                              type="radio"
                              name="payment"
                              value="bank_transfer"
                              checked={checkoutPayment === "bank_transfer"}
                              onChange={() => setCheckoutPayment("bank_transfer")}
                              className="accent-[#74070e]"
                            />
                            <span className="font-light text-gray-700">Chuyển khoản Ngân hàng (Miễn phí quẹt/phí nhận)</span>
                          </label>
                          <label className="flex items-center space-x-2.5 p-2.5 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-gray-200">
                            <input
                              type="radio"
                              name="payment"
                              value="cod"
                              checked={checkoutPayment === "cod"}
                              onChange={() => setCheckoutPayment("cod")}
                              className="accent-[#74070e]"
                            />
                            <span className="font-light text-gray-700">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#74070e] hover:bg-[#5a050a] text-white text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer font-medium"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Xác Nhận Đặt Hàng Ngay</span>
                    </button>
                    <p className="text-[10px] text-gray-400 text-center italic">* Khi nhấn nạp, một đơn hàng mô phỏng sẽ ngay lập tức được chuyển sắc lịch bảo hành quý tộc dạt dào sang tài khoản của quý cô.</p>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 bg-[#FCFBF9] rounded-2xl border border-gray-100 max-w-lg mx-auto space-y-5">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto stroke-1" />
                <h3 className="text-lg font-serif">Giỏ hàng của chị đang trống</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto font-light leading-relaxed">Hãy lựa chọn cho mình chiếc Áo Sơ Mi lụa tơ tằm mềm mát hoặc những mẫu chân váy xếp ly satin hoàng gia đầy thu hút của Chéri để bừng sáng khí chất tủ đồ nhé.</p>
                <button
                  onClick={() => setCurrentPage("products")}
                  className="bg-[#74070e] hover:bg-[#5a050a] text-white text-xs uppercase tracking-widest font-light py-3.5 px-8 rounded-full cursor-pointer shadow-sm"
                >
                  Mua sắm ngay cùng Chéri
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: ACCOUNT & ORDER DIRECTORY */}
        {currentPage === "account" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 animate-fade-in space-y-10">
            {/* User card banner */}
            <div className="bg-[#FAF8F5] border border-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#74070e]/80">
                  <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-serif text-gray-950 font-medium">{userProfile.name}</h3>
                  <div className="flex items-center space-x-2 justify-center sm:justify-start">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-[#74070e] text-white py-0.5 px-2.5 rounded-sm">
                      HẠNG {userProfile.memberTier.toUpperCase()} VIP
                    </span>
                    <span className="text-xs text-amber-800 font-mono font-medium">✨ 2,500 Chéri Points</span>
                  </div>
                </div>
              </div>

              {/* Quick statistics */}
              <div className="flex items-center space-x-8 text-center text-xs text-gray-500 font-light border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto justify-around sm:justify-end">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Mã Hội Viên</p>
                  <strong className="text-gray-800 font-semibold font-mono">CHR-29048-VIP</strong>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Tích điểm nhận quà</p>
                  <strong className="text-gray-800 font-semibold font-mono">Giảm 10% Trọn đời</strong>
                </div>
              </div>
            </div>

            {/* Split view: historical orders and settings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left historical list (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-lg font-serif text-gray-900 border-b border-gray-100 pb-3">Đơn hàng của Quý cô</h3>
                
                {userProfile.orders.length > 0 ? (
                  <div className="space-y-6">
                    {userProfile.orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
                      >
                        {/* Order code and status banner */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-3 gap-2">
                          <div>
                            <span className="text-xs text-gray-400 font-mono">Đơn ngày: {order.date}</span>
                            <h4 className="text-sm font-semibold text-gray-800 font-mono mt-0.5">Mã: {order.id}</h4>
                          </div>

                          <span className={`text-[10px] uppercase font-bold tracking-widest py-1 px-3 rounded-full flex items-center space-x-1 border ${
                            order.status === "delivered" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${order.status === "delivered" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                            <span>{order.statusText}</span>
                          </span>
                        </div>

                        {/* Order items lists */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-light">
                              <div className="space-y-0.5">
                                <p className="text-gray-800 font-normal">{item.productName}</p>
                                <p className="text-gray-400 text-[10px]">
                                  {item.size && <>Size: <strong>{item.size}</strong> | </>}
                                  {item.colorName && <>Màu: <strong>{item.colorName}</strong> | </>}
                                  Số lượng: <strong>{item.quantity}</strong>
                                </p>
                              </div>
                              <span className="text-gray-700 font-mono">{formatVND(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order footer delivery note */}
                        <div className="bg-[#FAF8F5]/80 rounded-lg p-3 text-[11px] text-gray-500 space-y-1 font-light">
                          <p className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#74070e]" />
                            <span>Giao đến sđt <strong>{order.phone}</strong> tại địa hạt: {order.address}</span>
                          </p>
                        </div>

                        {/* Total calculator */}
                        <div className="flex justify-between items-center text-xs pt-2">
                          <span className="text-gray-400">Thanh toán vương giả</span>
                          <strong className="text-sm font-bold text-[#74070e] font-sans">{formatVND(order.total)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl font-light text-gray-400 text-xs">
                    Chưa ghi nhận phản hồi đơn hàng nào.
                  </div>
                )}
              </div>

              {/* Right Profile updates (4 cols) */}
              <div className="lg:col-span-4 bg-[#FCFBF9] border border-gray-100 rounded-xl p-6 space-y-6">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-800 border-l-2 border-[#74070e] pl-2">Sổ sách hồ sơ</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-light">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Họ tên quý cô</label>
                    <input
                      type="text"
                      required
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 outline-none px-3 py-2.5 rounded-lg text-gray-800 focus:border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Email liên lạc</label>
                    <input
                      type="email"
                      required
                      readOnly
                      value={userProfile.email}
                      className="w-full bg-gray-50 border border-gray-200 outline-none px-3 py-2.5 rounded-lg text-gray-500 cursor-not-allowed"
                      title="Email không thể thay đổi sau khi đăng ký"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Điện thoại liên hệ</label>
                    <input
                      type="tel"
                      required
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 outline-none px-3 py-2.5 rounded-lg text-gray-800 focus:border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng mặc định</label>
                    <textarea
                      required
                      value={userProfile.address}
                      onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                      rows={3}
                      className="w-full bg-white border border-gray-200 outline-none px-3 py-2 rounded-lg text-gray-800 resize-none focus:border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Ảnh đại diện tuyển chọn</label>
                    <div className="flex items-center space-x-3.5 mb-2">
                      {AVATAR_PRESETS.map((pUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUserProfile({ ...userProfile, avatar: pUrl })}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            userProfile.avatar === pUrl ? "border-[#74070e] scale-105" : "border-transparent opacity-65"
                          }`}
                        >
                          <img src={pUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100/80 pt-4 space-y-3.5">
                    <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Đổi mật mã bảo mật</h4>
                    <div>
                      <label className="block text-[9px] text-gray-400 mb-1">Mật mã mới</label>
                      <input
                        type="password"
                        placeholder="Để trống nếu không muốn đổi"
                        value={accPassword}
                        onChange={(e) => setAccPassword(e.target.value)}
                        className="w-full bg-white border border-gray-200 outline-none px-3 py-1.5 rounded-lg text-gray-800 focus:border-[#74070e]/45"
                      />
                    </div>
                    {accPassword && (
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-1">Xác nhận mật mã mới</label>
                        <input
                          type="password"
                          required
                          value={accConfirmPassword}
                          onChange={(e) => setAccConfirmPassword(e.target.value)}
                          className="w-full bg-white border border-gray-200 outline-none px-3 py-1.5 rounded-lg text-gray-800 focus:border-[#74070e]/45"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-black text-white text-[10px] uppercase tracking-widest py-3.5 rounded-lg shadow-xs transition-colors cursor-pointer font-sans font-normal"
                  >
                    Lưu Sổ Địa Hạt & Đổi Mật Mã
                  </button>
                </form>

                <div className="border-t border-gray-200 pt-5 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUserProfile(GUEST_USER);
                      localStorage.setItem("cheri_is_logged_in", "false");
                      localStorage.removeItem("cheri_user");
                      showToast("Quý cô đã đăng xuất tài khoản an toàn 🌹", "info");
                      setCurrentPage("home");
                    }}
                    className="text-red-700 font-sans tracking-widest text-[11px] uppercase hover:opacity-80 flex items-center justify-center space-x-2 mx-auto cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 7: LOGIN RECRUITMENT PAGE */}
        {currentPage === "login" && (
          <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FCFBF9] border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
              
              {/* Left Side: Premium Visuals banner */}
              <div className="relative hidden md:block aspect-[4/5] bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600" 
                  alt="Chéri luxury silk collections banner" 
                  className="absolute inset-0 w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-8 text-white space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300">Tuyển tập lụa là Chéri</span>
                  <h4 className="text-xl font-serif font-light leading-relaxed">Rạng rỡ khí chất thượng quý, nâng niu làn da nhạy cảm tuyệt đối.</h4>
                  <p className="text-[11px] text-gray-300 font-light">Thăng hoa trong từng nhịp dệt lụa tơ tằm Mulberry vương giả.</p>
                </div>
              </div>

              {/* Right Side: Login Input Form */}
              <div className="p-8 sm:p-12 flex flex-col justify-center space-y-8 bg-white">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-gray-900">Quý cô đồng hành</h3>
                  <p className="text-xs text-gray-400 font-light font-sans">Xin nhập thông tin tài khoản Hội viên để tiếp tục hành trình thượng lưu.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs font-light text-gray-700">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Địa chỉ Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="email" 
                        required
                        placeholder="contact.cheri@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none pl-11 pr-4 py-3 rounded-xl text-gray-800 transition-colors text-xs font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Mật mã bảo mật</label>
                      <button 
                        type="button" 
                        onClick={() => {
                          showToast("Thông tin gợi ý: Tài khoản Nguyễn Thơ có mật mã 'cheri123', tài khoản Huyền My có mật mã '123' 🌹", "info");
                        }}
                        className="text-[10px] text-[#74070e] hover:underline cursor-pointer"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-350" />
                      <input 
                        type={showLoginPassword ? "text" : "password"} 
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none pl-11 pr-12 py-3 rounded-xl text-gray-800 transition-colors text-xs font-light"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 hover:text-[#74070e] font-sans text-[10px] font-medium p-1 cursor-pointer"
                      >
                        {showLoginPassword ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#74070e] hover:bg-[#5a050a] text-white text-xs uppercase tracking-widest py-4 rounded-xl shadow-xs transition-colors cursor-pointer font-sans font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Tham nhập hội viên</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-300">
                    <span className="bg-white px-3 z-10">Mạng xã hội phủ hợp</span>
                    <div className="absolute top-1/2 left-0 right-0 border-t border-gray-100 -z-0"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setLoginEmail("contact.cheri@gmail.com");
                        setLoginPassword("cheri123");
                        showToast("Đã điền tài khoản VIP Nguyễn Thơ! Quý cô nhấn Đăng nhập nhé ✨");
                      }}
                      className="border border-gray-100 hover:border-gray-250 py-2.5 px-4 rounded-xl text-[11px] font-medium text-gray-600 bg-[#FAF8F5] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#74070e]" />
                      <span>Nguyễn Thơ (VIP)</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setLoginEmail("test@gmail.com");
                        setLoginPassword("123");
                        showToast("Đã điền tài khoản Huyền My! Quý cô nhấn Đăng nhập nhé ✨");
                      }}
                      className="border border-gray-100 hover:border-gray-250 py-2.5 px-4 rounded-xl text-[11px] font-medium text-gray-600 bg-[#FAF8F5] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#74070e]" />
                      <span>Huyền My (Silver)</span>
                    </button>
                  </div>

                  <p className="text-center text-[11px] font-light text-gray-400">
                    Chưa đăng ký bảo chứng thượng hạng?{" "}
                    <button 
                      onClick={() => setCurrentPage("register")}
                      className="text-[#74070e] font-normal hover:underline cursor-pointer"
                    >
                      Tạo tài khoản mới ngay
                    </button>
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 8: REGISTER NEW ACCOUNT PAGE */}
        {currentPage === "register" && (
          <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FCFBF9] border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
              
              {/* Left hand Side: Premium Visuals */}
              <div className="relative hidden md:block aspect-[4/5] bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" 
                  alt="Chéri luxury membership visual banner" 
                  className="absolute inset-0 w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-8 text-white space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300">Đặc quyền Thượng Khách</span>
                  <h4 className="text-xl font-serif font-light leading-relaxed">Đăng ký thành viên Chéri để nhận chiết khấu 10% trọn đời và tích lũy điểm thưởng.</h4>
                  <p className="text-[11px] text-gray-300 font-light">Thoả sức chọn mua lụa là, trang dạ hội và vest may đo độc bản.</p>
                </div>
              </div>

              {/* Right hand Side: Register Input Form */}
              <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white overflow-y-auto">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-gray-900">Hội viên thượng lưu</h3>
                  <p className="text-xs text-gray-400 font-light font-sans">Quý cô vui lòng gửi gắm đúng các chi tiết cá nhân để nhận quà tặng tri ân tốt nhất.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-light text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Họ tên chị đẹp</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ninh Dương Lan Ngọc"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none px-3.5 py-2.5 rounded-xl text-gray-800 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Số điện thoại</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="0909 123 456"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none px-3.5 py-2.5 rounded-xl text-gray-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="lanngoc@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none px-3.5 py-2.5 rounded-xl text-gray-800 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Địa chỉ mặc định</label>
                    <textarea 
                      required
                      placeholder="79 Đường 3/2, Quận 10, Thành phố Hồ Chí Minh"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none px-3.5 py-2.5 rounded-xl text-gray-800 resize-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Mật mã bảo mật</label>
                      <input 
                        type={showRegPassword ? "text" : "password"} 
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none px-3.5 py-2.5 rounded-xl text-gray-800 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Nhập lại Mật mã</label>
                      <input 
                        type={showRegPassword ? "text" : "password"} 
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#74070e]/40 outline-none px-3.5 py-2.5 rounded-xl text-gray-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-1 text-[10px] text-gray-400">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showRegPassword}
                        onChange={() => setShowRegPassword(!showRegPassword)}
                        className="accent-[#74070e]"
                      />
                      <span>Hiển thị mật mã rõ nét</span>
                    </label>
                  </div>

                  {/* Visual Avatar Presets picker */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest">Chọn Chân Dung Hồ Sơ Quý Cô</label>
                    <div className="flex items-center space-x-4">
                      {AVATAR_PRESETS.map((pUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRegSelectedAvatar(pUrl)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            regSelectedAvatar === pUrl ? "border-[#74070e] scale-110" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={pUrl} alt={`Preset Avatar ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#74070e] hover:bg-[#5a050a] text-white text-xs uppercase tracking-widest py-4 rounded-xl shadow-xs transition-colors cursor-pointer font-sans font-medium flex items-center justify-center space-x-2 mt-2"
                  >
                    <span>Biên Chép Hồ Sơ Gia Nhập</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </form>

                <p className="text-center text-[11px] font-light text-gray-400 pt-2">
                  Đã được bảo chứng thành viên?{" "}
                  <button 
                    onClick={() => setCurrentPage("login")}
                    className="text-[#74070e] font-normal hover:underline cursor-pointer"
                  >
                    Đăng nhập ngay tại đây
                  </button>
                </p>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Global MODAL: Product Detail Quick-View */}
      {quickViewProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div 
            className="bg-white rounded-none border border-[#74070e]/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-none relative grid grid-cols-1 md:grid-cols-2 p-6 sm:p-10 gap-8 animate-fade-in text-[#74070e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close modal */}
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#74070e] p-1.5 rounded-none hover:bg-stone-50 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Images gallery previews */}
            <div className="space-y-3">
              <div className="aspect-[3/4] bg-[#FCFBF9] rounded-none overflow-hidden border border-[#74070e]/10">
                <img src={previewImage} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>
              {/* Thumbnail captures */}
              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start max-h-36 overflow-y-auto scrollbar-none">
                {(quickViewProduct.images && quickViewProduct.images.length > 0 
                  ? quickViewProduct.images 
                  : [quickViewProduct.image, quickViewProduct.secondaryImage]
                ).map((imgUrl, imgIdx) => (
                  <button 
                    key={imgIdx}
                    onClick={() => setPreviewImage(imgUrl)}
                    className={`w-12 h-16 rounded-none overflow-hidden border bg-[#FCFBF9] transition-all cursor-pointer flex-shrink-0 ${previewImage === imgUrl ? "border-[#74070e]" : "border-[#74070e]/10"}`}
                  >
                    <img src={imgUrl} alt={`Preview ${imgIdx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: options choose sizing & checkout details */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#74070e] bg-[#74070e]/5 px-3 py-1 rounded-sm inline-block">
                    {quickViewProduct.categoryName}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-gray-950 font-medium leading-tight pt-1">{quickViewProduct.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[#74070e]">{formatVND(quickViewProduct.price)}</span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{formatVND(quickViewProduct.originalPrice)}</span>
                    )}
                  </div>
                </div>



                {/* Classification choices selection (Phân loại) */}
                {((quickViewProduct as any).classifications && (quickViewProduct as any).classifications.length > 0) && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">Phân loại</span>
                    <div className="flex flex-wrap gap-2">
                      {(quickViewProduct as any).classifications.map((cl: string) => (
                        <button
                          key={cl}
                          onClick={() => setSelectedClassification(cl)}
                          className={`px-3 py-1.5 border text-xs font-light tracking-wide cursor-pointer transition-all ${
                            selectedClassification === cl
                              ? "bg-[#74070e] text-white border-[#74070e]"
                              : "bg-white text-gray-600 border-[#74070e]/10 hover:border-[#74070e]"
                          }`}
                        >
                          {cl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color choices selection */}
                {(quickViewProduct.colors && quickViewProduct.colors.length > 0) && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">Chọn Màu sắc</span>
                    <div className="flex items-center space-x-3.5">
                      {quickViewProduct.colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            selectedColor && selectedColor.hex === color.hex ? "border-[#74070e] scale-102" : "border-gray-200"
                          }`}
                          title={color.name}
                        >
                          <span 
                            className="w-6 h-6 rounded-full inline-block cursor-pointer shadow-inner border border-black/5" 
                            style={{ backgroundColor: color.hex }}
                          ></span>
                        </button>
                      ))}
                    </div>
                    {selectedColor && (
                      <span className="text-[11px] text-gray-700 font-light block">Đã chọn màu: <strong>{selectedColor.name}</strong></span>
                    )}
                  </div>
                )}

                {/* Sizing choosing */}
                {(quickViewProduct.sizes && quickViewProduct.sizes.length > 0) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                      <span>Chọn Kích Cỡ</span>
                      <button 
                        onClick={() => alert("Hướng dẫn chọn Size:\n\n- Size S: Vòng ngực 82-86cm, Eo 64-68cm, Nặng 44-48kg\n- Size M: Vòng ngực 86-90cm, Eo 68-72cm, Nặng 49-53kg\n- Size L: Vòng ngực 90-94cm, Eo 72-76cm, Nặng 54-58kg\n\nQuý cô cũng có thể hỏi Stylist Chéri ở góc phải dưới màn hình tư vấn thêm ạ.")}
                        className="text-[#74070e] lowercase tracking-wide cursor-pointer hover:underline"
                      >
                        (Bảng số đo size)
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      {quickViewProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-8 h-8 rounded-none border text-xs font-light tracking-wide cursor-pointer flex items-center justify-center transition-all ${
                            selectedSize === size
                              ? "bg-[#74070e] text-white border-[#74070e]"
                              : "bg-white text-gray-600 border-[#74070e]/10 hover:border-[#74070e]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spec Bullet points details with scroll */}
                <div className="border-t border-[#74070e]/10 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#74070e]/60 block mb-2">Mô tả sản phẩm</span>
                  <div className="text-[11px] font-light text-gray-500 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {quickViewProduct.description || "Chưa có thông tin mô tả chi tiết."}
                  </div>
                </div>
              </div>

              {/* Action buttons footer modal */}
              <div className="flex items-center space-x-4 pt-4 border-t border-[#74070e]/10">
                <button
                  onClick={handleAddFromModal}
                  className="flex-1 bg-[#74070e] hover:opacity-90 text-white text-xs uppercase tracking-[0.2em] py-4 rounded-none font-light transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
                <button
                  onClick={(e) => {
                    handleToggleWishlist(quickViewProduct.id, e);
                  }}
                  className="bg-[#FCFBF9] hover:bg-stone-50 border border-[#74070e]/10 text-[#74070e] p-4 rounded-none transition-all cursor-pointer"
                  title="Thêm yêu thích"
                >
                  <Heart className={`w-4.5 h-4.5 ${wishlist.includes(quickViewProduct.id) ? "fill-[#74070e] text-[#74070e]" : "text-[#74070e]/30"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global MODAL: Search input overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black py-0.5 px-1.5 rounded"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleTriggerHeaderSearch} className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold border-l-2 border-[#74070e] pl-2">Quý cô muốn tìm kiếm thiết kế gì?</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  autoFocus
                  value={headerSearchInput}
                  onChange={(e) => setHeaderSearchInput(e.target.value)}
                  placeholder="Cách chọn Sơ mi lụa, Đầm satin tiệc..."
                  className="flex-1 bg-gray-50 border border-transparent focus:border-gray-200 outline-none rounded-xl text-sm px-4 py-3 text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-[#74070e] hover:bg-[#5a050a] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-xl cursor-pointer"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>

            {/* Quick tag tips inside popup */}
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-gray-400 font-light uppercase tracking-wider items-center">
              <span>Gợi Ý Tìm Kiếm:</span>
              {["lụa mulberry", "satin classic", "blazer", "chân váy xếp ly"].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => {
                    setHeaderSearchInput(tag);
                  }}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-2.5 py-1 rounded border border-gray-100 cursor-pointer text-[9px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Boutique Chatbox Trực Tuyến */}
      <Chatbox />

      {/* Footer component matches screenshot */}
      <Footer />

    </div>
  );
}
