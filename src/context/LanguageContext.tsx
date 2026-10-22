import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'ta' | 'hi';

interface Translations {
  tagline: string;
  missionShort: string;
  searchPlaceholder: string;
  shopProduce: string;
  sellOnFarmBridge: string;
  exploreFarmers: string;
  freshToday: string;
  mandiComparison: string;
  surplusDeals: string;
  groupOrders: string;
  weeklyBaskets: string;
  impactMetrics: string;
  helplines: string;
  trustLadder: string;
  platformFeeZero: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
  cart: string;
  checkout: string;
  farmer: string;
  visitor: string;
  customer: string;
  business: string;
  fpo: string;
  delivery: string;
  admin: string;
}

const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    tagline: 'From Farmers to Families, More Directly.',
    missionShort: 'Digital marketplace with 5-level trust verification, harvest traceability & transparent prices.',
    searchPlaceholder: 'Search tomatoes, onions, millets, village or PIN code...',
    shopProduce: 'Shop Fresh Produce',
    sellOnFarmBridge: 'Sell on FarmBridge',
    exploreFarmers: 'Explore Nearby Farmers',
    freshToday: 'Harvested Today',
    mandiComparison: 'Local Mandi Price Check',
    surplusDeals: 'Surplus Freshness Deals',
    groupOrders: 'Hyperlocal Group Orders',
    weeklyBaskets: 'Weekly Produce Baskets',
    impactMetrics: 'Demonstration Pilot Impact',
    helplines: 'Agricultural Helplines',
    trustLadder: '5-Level Verification Ladder',
    platformFeeZero: 'Platform Fee: ₹0 for Farmers & Customers',
    level1: 'Level 1: Phone Verified',
    level2: 'Level 2: Farm Evidence Reviewed',
    level3: 'Level 3: Locally Verified',
    level4: 'Level 4: Certificate Verified',
    level5: 'Level 5: Residue Report Verified',
    cart: 'Cart',
    checkout: 'Checkout',
    farmer: 'Farmer',
    visitor: 'Public Visitor',
    customer: 'Household Customer',
    business: 'Business Buyer',
    fpo: 'FPO / Farmer Group',
    delivery: 'Delivery Partner',
    admin: 'Admin & Verifier',
  },
  ta: {
    tagline: 'விவசாயிகளிடமிருந்து குடும்பங்களுக்கு நேரடியாக.',
    missionShort: '5-நிலை நம்பிக்கை சரிபார்ப்பு, அறுவடை தடமறிதல் மற்றும் வெளிப்படையான சந்தை விலை.',
    searchPlaceholder: 'தக்காளி, வெங்காயம், சிறுதானியங்கள், ஊர் அல்லது அஞ்சல் குறியீடு...',
    shopProduce: 'புதிய விளைபொருட்கள்',
    sellOnFarmBridge: 'விவசாயி விற்பனை',
    exploreFarmers: 'அருகிலுள்ள விவசாயிகள்',
    freshToday: 'இன்று அறுவடை செய்யப்பட்டது',
    mandiComparison: 'மண்டி விலை ஒப்பீடு',
    surplusDeals: 'புதிய தள்ளுபடி வாய்ப்புகள்',
    groupOrders: 'குழு கொள்முதல்',
    weeklyBaskets: 'வாராந்திர காய்கறி கூடை',
    impactMetrics: 'திட்டத்தின் தாக்கம்',
    helplines: 'விவசாய உதவி எண்கள்',
    trustLadder: '5-நிலை நம்பிக்கை ஏணி',
    platformFeeZero: 'தள கட்டணம்: ₹0 முற்றிலும் இலவசம்',
    level1: 'நிலை 1: தொலைபேசி சரிபார்க்கப்பட்டது',
    level2: 'நிலை 2: பண்ணை சான்று சரிபார்க்கப்பட்டது',
    level3: 'நிலை 3: உள்ளூர் உறுதிப்படுத்தல்',
    level4: 'நிலை 4: சான்றிதழ் சரிபார்க்கப்பட்டது',
    level5: 'நிலை 5: பூச்சிக்கொல்லி எச்ச அறிக்கை',
    cart: 'கூடை',
    checkout: 'பணம் செலுத்துதல்',
    farmer: 'விவசாயி',
    visitor: 'பார்வையாளர்',
    customer: 'குடும்ப வாடிக்கையாளர்',
    business: 'வணிக வாங்குபவர்',
    fpo: 'உழவர் உற்பத்தியாளர் சங்கம்',
    delivery: 'விநியோக தோழர்',
    admin: 'நிர்வாகி',
  },
  hi: {
    tagline: 'खेतों से परिवारों तक, सीधे और पारदर्शी।',
    missionShort: '5-स्तरीय प्रमाणन, फसल ट्रैसिबिलिटी और पारदर्शी मंडी भाव के साथ सीधा डिजिटल बाज़ार।',
    searchPlaceholder: 'टमाटर, प्याज, बाजरा, गाँव या पिन कोड खोजें...',
    shopProduce: 'ताज़ी उपज खरीदें',
    sellOnFarmBridge: 'फार्मब्रिज पर बेचें',
    exploreFarmers: 'आस-पास के किसान',
    freshToday: 'आज की ताज़ी कटाई',
    mandiComparison: 'स्थानीय मंडी भाव तुलना',
    surplusDeals: 'सरप्लस ताज़ा छूट',
    groupOrders: 'मोहल्ला समूह ऑर्डर',
    weeklyBaskets: 'साप्ताहिक सब्ज़ी टोकरी',
    impactMetrics: 'पायलट प्रभाव आंकड़े',
    helplines: 'कृषि हेल्पलाइन',
    trustLadder: '5-स्तरीय सत्यापन सीढ़ी',
    platformFeeZero: 'प्लेटफ़ॉर्म शुल्क: ₹0 किसानों और ग्राहकों के लिए',
    level1: 'स्तर 1: फ़ोन सत्यापित',
    level2: 'स्तर 2: खेत प्रमाण समीक्षा',
    level3: 'स्तर 3: स्थानीय सत्यापन',
    level4: 'स्तर 4: प्रमाणपत्र सत्यापित',
    level5: 'स्तर 5: कीटनाशक अवशेष रिपोर्ट',
    cart: 'कार्ट',
    checkout: 'चेकआउट',
    farmer: 'किसान',
    visitor: 'आगंतुक',
    customer: 'घरेलू ग्राहक',
    business: 'थोक खरीदार',
    fpo: 'किसान उत्पादक संगठन (FPO)',
    delivery: 'डिलीवरी पार्टनर',
    admin: 'प्रशासक',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
