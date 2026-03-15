export interface Product {
  id: number;
  code: string;
  nameEn: string;
  nameTa: string;
  descriptionEn: string;
  descriptionTa: string;
  price: number;
  priceFormatted: string;
  category: string;
  materialEn: string;
  materialTa: string;
  includesEn: string[];
  includesTa: string[];
  tags: string[];
  badge?: 'new' | 'bestseller';
  // Image path - will use public/images/products/[filename]
  // For now, products use CSS gradient placeholders
  // When you add real photos, set image to e.g. "/images/products/bridal-set-1.jpg"
  image?: string;
  gradientPlaceholder: string; // CSS gradient for placeholder
}

export const products: Product[] = [
  {
    id: 1,
    code: "AJ-BS-001",
    nameEn: "Royal Bridal Choker & Haram Set",
    nameTa: "ராயல் திருமண சோக்கர் & ஹாரம் செட்",
    descriptionEn: "Stunning gold-plated bridal set featuring an ornate choker necklace with intricate floral and peacock motifs, a matching long haram necklace encrusted with CZ stones, and elegant jhumka earrings. The choker features dangling south sea pearl drops and ruby-emerald stone work.",
    descriptionTa: "அற்புதமான தங்கம் பூசிய திருமண செட் - நுட்பமான பூ மற்றும் மயில் உருவங்களுடன் கூடிய அலங்கார சோக்கர் நெக்லஸ், CZ கற்கள் பதித்த நீண்ட ஹாரம் நெக்லஸ், மற்றும் நேர்த்தியான ஜிமிக்கி காதணிகள். சோக்கரில் தொங்கும் முத்து சொட்டுகள் மற்றும் ரூபி-மரகத கல் வேலைப்பாடு உள்ளது.",
    price: 3200,
    priceFormatted: "₹3,200",
    category: "bridalSets",
    materialEn: "1-Gram Gold Plated, CZ/American Diamonds, Synthetic Ruby & Emerald, Faux South Sea Pearls",
    materialTa: "1-கிராம் தங்கம் பூசிய, CZ/அமெரிக்கன் டைமண்ட்கள், செயற்கை ரூபி & மரகதம், போலி தென்கடல் முத்துக்கள்",
    includesEn: ["Choker Necklace", "Long Haram Necklace", "Matching Jhumka Earrings"],
    includesTa: ["சோக்கர் நெக்லஸ்", "நீண்ட ஹாரம் நெக்லஸ்", "பொருத்தமான ஜிமிக்கி காதணிகள்"],
    tags: ["bridal", "choker", "haram", "CZ", "pearl"],
    badge: "bestseller",
    gradientPlaceholder: "linear-gradient(135deg, #2a1810 0%, #8B6914 30%, #D4A853 50%, #8B6914 70%, #2a1810 100%)",
  },
  {
    id: 2,
    code: "AJ-TN-002",
    nameEn: "Aqua Jade Temple Necklace",
    nameTa: "அக்வா ஜேட் கோயில் நெக்லஸ்",
    descriptionEn: "Beautiful double-strand aqua jade bead necklace with an ornate gold-plated Lakshmi temple pendant. The pendant features intricate deity carvings surrounded by coin motifs, CZ stone detailing, ruby accents, and delicate pearl drops with turquoise bead dangles.",
    descriptionTa: "அழகான இரட்டை சரம் அக்வா ஜேட் மணி நெக்லஸ் - அலங்கார தங்கம் பூசிய லட்சுமி கோயில் பதக்கத்துடன். பதக்கத்தில் நுட்பமான தெய்வ செதுக்கல்கள், நாணய உருவங்கள், CZ கல் வேலைப்பாடு, ரூபி, மற்றும் முத்து சொட்டுகள் உள்ளன.",
    price: 1450,
    priceFormatted: "₹1,450",
    category: "beadNecklaces",
    materialEn: "Gold-Plated Alloy Pendant, Natural Aqua Jade Beads, CZ Stones, Faux Pearls, Synthetic Ruby",
    materialTa: "தங்கம் பூசிய உலோகக்கலவை பதக்கம், இயற்கை அக்வா ஜேட் மணிகள், CZ கற்கள், போலி முத்துக்கள், செயற்கை ரூபி",
    includesEn: ["Bead Necklace with Temple Pendant"],
    includesTa: ["கோயில் பதக்கத்துடன் மணி நெக்லஸ்"],
    tags: ["temple", "beads", "Lakshmi", "jade", "turquoise"],
    badge: "new",
    gradientPlaceholder: "linear-gradient(135deg, #0a1a2a 0%, #0d7377 30%, #14cdcf 50%, #0d7377 70%, #0a1a2a 100%)",
  },
  {
    id: 3,
    code: "AJ-TN-003",
    nameEn: "Lavender Jade Temple Necklace",
    nameTa: "லாவெண்டர் ஜேட் கோயில் நெக்லஸ்",
    descriptionEn: "Elegant double-strand lavender jade bead necklace featuring a gold-plated Lakshmi temple pendant with intricate deity motifs, coin medallions, CZ stone embellishments, emerald accents, and pearl with lavender bead drops. A unique color for the modern traditional woman.",
    descriptionTa: "நேர்த்தியான இரட்டை சரம் லாவெண்டர் ஜேட் மணி நெக்லஸ் - தங்கம் பூசிய லட்சுமி கோயில் பதக்கத்துடன். நுட்பமான தெய்வ உருவங்கள், நாணய பதக்கங்கள், CZ கல் அலங்காரங்கள், மரகத, முத்து மற்றும் லாவெண்டர் மணி சொட்டுகள். நவீன பாரம்பரிய பெண்ணுக்கு ஒரு தனித்துவமான நிறம்.",
    price: 1450,
    priceFormatted: "₹1,450",
    category: "beadNecklaces",
    materialEn: "Gold-Plated Alloy Pendant, Natural Lavender Jade Beads, CZ Stones, Faux Pearls, Synthetic Emerald",
    materialTa: "தங்கம் பூசிய உலோகக்கலவை பதக்கம், இயற்கை லாவெண்டர் ஜேட் மணிகள், CZ கற்கள், போலி முத்துக்கள், செயற்கை மரகதம்",
    includesEn: ["Bead Necklace with Temple Pendant"],
    includesTa: ["கோயில் பதக்கத்துடன் மணி நெக்லஸ்"],
    tags: ["temple", "beads", "Lakshmi", "jade", "lavender"],
    gradientPlaceholder: "linear-gradient(135deg, #1a0a2a 0%, #7B4FA2 30%, #C8A2E8 50%, #7B4FA2 70%, #1a0a2a 100%)",
  },
  {
    id: 4,
    code: "EPPM",
    nameEn: "Empress Bridal Complete Set",
    nameTa: "எம்ப்ரஸ் திருமண முழு செட்",
    descriptionEn: "Magnificent complete bridal jewelry set featuring a short necklace and long haram, both adorned with alternating ruby and emerald square stones in gold settings. The set includes matching chandelier jhumka earrings and an elegant maang tikka. Pendants feature Lakshmi deity motifs with CZ diamonds and cascading pearl drops.",
    descriptionTa: "அற்புதமான முழுமையான திருமண நகை செட் - குறுகிய நெக்லஸ் மற்றும் நீண்ட ஹாரம், இரண்டிலும் மாறி மாறி ரூபி மற்றும் மரகத சதுர கற்கள் தங்க அமைப்பில். இந்த செட்டில் பொருத்தமான சாண்டிலியர் ஜிமிக்கி காதணிகள் மற்றும் நேர்த்தியான மாங் டிக்கா உள்ளன. பதக்கங்களில் லட்சுமி தெய்வ உருவங்கள், CZ வைரங்கள் மற்றும் அடுக்கடுக்கான முத்து சொட்டுகள் உள்ளன.",
    price: 4650,
    priceFormatted: "₹4,650",
    category: "bridalSets",
    materialEn: "1-Gram Gold Plated, CZ/American Diamonds, Synthetic Ruby & Emerald Stones, Faux Pearls",
    materialTa: "1-கிராம் தங்கம் பூசிய, CZ/அமெரிக்கன் டைமண்ட்கள், செயற்கை ரூபி & மரகத கற்கள், போலி முத்துக்கள்",
    includesEn: ["Short Necklace", "Long Haram Necklace", "Matching Jhumka Earrings", "Maang Tikka"],
    includesTa: ["குறுகிய நெக்லஸ்", "நீண்ட ஹாரம் நெக்லஸ்", "பொருத்தமான ஜிமிக்கி காதணிகள்", "மாங் டிக்கா"],
    tags: ["bridal", "complete set", "ruby", "emerald", "CZ", "maang tikka"],
    badge: "bestseller",
    gradientPlaceholder: "linear-gradient(135deg, #1a0a10 0%, #8B1A4A 30%, #D4536A 50%, #8B1A4A 70%, #1a0a10 100%)",
  },
];

export const WHATSAPP_NUMBER = "919876543210"; // Replace with actual WhatsApp number
