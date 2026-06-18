'use client'
import { useState } from 'react'
import { useT } from '@/hooks/useT'

const FAQS_AR = [
  { q: 'ما هي مواد مناديل نَدى الحرير؟', a: 'تُصنَّع مناديلنا من ألياف طبيعية نقية ١٠٠٪ بدون أي كيماويات ضارة، معتمدة من هيئة الغذاء والدواء السعودية SFDA، وآمنة تماماً للبشرة الحساسة وبشرة الأطفال.' },
  { q: 'كم يستغرق التوصيل؟', a: 'داخل الرياض: ١–٢ يوم عمل. باقي مناطق المملكة: ٢–٥ أيام عمل. نقدم شحناً مجانياً للطلبات فوق ١٥٠ ريال.' },
  { q: 'هل يمكنني إرجاع المنتج؟', a: 'نعم، نوفر سياسة إرجاع مجانية خلال ٧ أيام من استلام الطلب بدون أي أسئلة. فقط تواصل معنا عبر واتساب وسنرتب الاستلام.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل مدى، فيزا، ماستركارد، Apple Pay، الدفع عند الاستلام (COD)، تابي وتمارا للتقسيط بدون فائدة.' },
  { q: 'هل المنتجات آمنة للأطفال والبشرة الحساسة؟', a: 'بالتأكيد. جميع منتجاتنا خالية من العطور والمواد الكيميائية المهيجة، ومعتمدة طبياً وآمنة تماماً للرضع والبشرة الحساسة.' },
  { q: 'هل تتوفر عروض للشراء بالجملة؟', a: 'نعم! نقدم خصم ٥٪ عند شراء منتجين، ١٠٪ عند ٣ منتجات، و١٥٪ عند ٤ منتجات فأكثر. تصفح صفحة بكج التوفير لمزيد من التفاصيل.' },
]
const FAQS_EN = [
  { q: 'What materials are Nada Al-Hareer tissues made of?', a: 'Our tissues are made from 100% pure natural fibers with no harmful chemicals, certified by SFDA, and completely safe for sensitive skin and babies.' },
  { q: 'How long does delivery take?', a: 'Within Riyadh: 1–2 business days. Rest of Saudi Arabia: 2–5 business days. Free shipping on orders over 150 SAR.' },
  { q: 'Can I return a product?', a: 'Yes, we offer a free return policy within 7 days of receiving your order, no questions asked. Just contact us via WhatsApp and we will arrange the pickup.' },
  { q: 'What payment methods are available?', a: 'We accept Mada, Visa, Mastercard, Apple Pay, Cash on Delivery (COD), Tabby and Tamara for interest-free installments.' },
  { q: 'Are the products safe for children and sensitive skin?', a: 'Absolutely. All our products are fragrance-free, chemical-free, medically certified, and completely safe for infants and sensitive skin.' },
  { q: 'Are there bulk purchase deals?', a: 'Yes! We offer 5% off when buying 2 products, 10% for 3, and 15% for 4+. Browse our Bundle page for more details.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const { lang } = useT()
  const faqs = lang === 'ar' ? FAQS_AR : FAQS_EN

  return (
    <section className="py-12 md:py-16 bg-primary-50">
      <div className="max-w-screen-md mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{ fontFamily: 'Amiri, serif' }}>
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            <span className="text-primary-400">.</span>
          </h2>
          <p className="text-primary-400 text-sm mt-2">
            {lang === 'ar' ? 'كل ما تريد معرفته عن منتجاتنا وخدمتنا' : 'Everything you need to know about our products and service'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-primary-100 rounded-2xl overflow-hidden hover:border-primary-300 transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-right gap-3"
              >
                <span className="font-black text-sm text-primary-900 text-right flex-1">{faq.q}</span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open === i ? 'g-gold text-white rotate-45' : 'bg-primary-100 text-primary-600'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '200px' : '0px' }}
              >
                <p className="px-5 pb-4 text-sm text-primary-600 leading-relaxed border-t border-primary-50 pt-3">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
