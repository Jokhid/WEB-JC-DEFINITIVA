import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Home, 
  HeartPulse, 
  PiggyBank, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";

// --- Smooth Scroll (Lenis) Hook & Setup ---
const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize Lenis premium physical scrolling properties
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Physical inertial curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
};

// --- Premium Animation Helper Components ---

// Real time text curtain reveal using CSS clip-path mask
const CurtainText = ({ children, delay = 0, className = "inline-block" }: { children: ReactNode; delay?: number; className?: string }) => {
  return (
    <span className={`relative overflow-hidden pb-1 -mb-1 block ${className}`}>
      <motion.span
        initial={{ y: "105%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{
          type: "spring",
          stiffness: 65,
          damping: 17,
          mass: 0.95,
          delay: delay
        }}
        className="block origin-bottom"
      >
        {children}
      </motion.span>
    </span>
  );
};

// Revealing image from a "veil/curtain" that lifts off, whilst the image zooms out
const CurtainImageReveal = ({ src, alt, className = "", delay = 0 }: { src: string; alt: string; className?: string; delay?: number }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{
          type: "spring",
          stiffness: 35,
          damping: 15,
          mass: 1.1,
          delay: delay
        }}
        className="w-full h-full"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover grayscale-[15%] filter"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <motion.div
        initial={{ y: "0%" }}
        whileInView={{ y: "-100%" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{
          type: "spring",
          stiffness: 55,
          damping: 16,
          mass: 1.05,
          delay: delay
        }}
        className="absolute inset-0 bg-[#111827] z-20 pointer-events-none"
      />
    </div>
  );
};

// Custom premium CSS clip-path entire section curtain rising up
const CurtainSectionReveal = ({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) => {
  return (
    <motion.section
      id={id}
      initial={{ clipPath: "polygon(0 8%, 100% 8%, 100% 100%, 0 100%)", opacity: 0.85 }}
      whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        type: "spring",
        stiffness: 45,
        damping: 15,
        mass: 1.1
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// --- Custom Spring-loaded Dropdown Accordion for FAQs (no native jumpy details markup) ---
const AccordionItem = ({ q, a, index }: { q: string; a: string; index: number; key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18, delay: index * 0.08 }}
      className="border-b border-gray-100 last:border-none py-2"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 text-left outline-none group cursor-pointer"
      >
        <span className="font-serif italic text-xl md:text-3xl text-brand-dark group-hover:text-brand-orange transition-colors duration-300">
          {q}
        </span>
        <motion.div
          animate={{ 
            rotate: isOpen ? 180 : 0, 
            backgroundColor: isOpen ? "#FF6600" : "transparent", 
            color: isOpen ? "#ffffff" : "#FF6600",
            borderColor: isOpen ? "#FF6600" : "#E5E7EB"
          }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-brand-orange shrink-0 ml-4 group-hover:border-brand-orange/40 transition-colors"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="overflow-hidden"
      >
        <div className="pb-8 text-brand-gray text-base md:text-lg leading-relaxed font-light max-w-3xl">
          {a}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Structural Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 w-full z-50 px-4 md:px-8">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.1 }}
        className="max-w-7xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] px-6 md:px-10 h-20 flex items-center justify-between"
      >
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105">
            <img src="/logo.png" alt="Logo Protección Financiera" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-[12px] font-black uppercase tracking-[0.25em] text-brand-dark/60">
          {["Servicios", "Autónomos", "Familias", "Sobre mí"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(" ", "-").replace("í", "i")}`} 
              className="hover:text-brand-orange transition-colors relative group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            href="#diagnostico" 
            className="bg-brand-dark text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-orange hover:shadow-[0_10px_25px_rgba(255,102,0,0.15)] transition-all duration-300 block"
          >
            Diagnóstico
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-dark w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 p-10 flex flex-col gap-8 font-black uppercase tracking-widest text-sm shadow-2xl"
          >
            {["Servicios", "Autónomos", "Familias", "Sobre mí", "Diagnóstico gratuito"].map((item, i) => (
              <a 
                key={i}
                href={`#${item.toLowerCase().replace(" ", "-").replace("í", "i")}`} 
                onClick={() => setIsOpen(false)}
                className={item === "Diagnóstico gratuito" ? "text-brand-orange" : "text-brand-dark hover:text-brand-orange transition-colors"}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 md:pt-[13rem] md:pb-40 overflow-hidden bg-[#FAFAFA]">
      {/* Light glow accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4 opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[110px] translate-y-1/2 -translate-x-1/4 opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-brand-orange"></span>
            <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px]">Asesoría de Élite</span>
          </div>

          <h1 className="text-5xl md:text-[6.2rem] font-serif leading-[0.94] tracking-tighter mb-10 text-brand-dark">
            <CurtainText delay={0.05}>Protege tus ingresos,</CurtainText>
            <CurtainText delay={0.15}>
              tu <span className="text-brand-orange italic font-light">vivienda</span> e hijos
            </CurtainText>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.35 }}
            className="text-xl md:text-2xl text-brand-gray mb-14 max-w-xl leading-relaxed font-light"
          >
            Estrategia financiera humana y técnica para familias y autónomos que valoran la seguridad.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href="#diagnostico" 
              className="px-12 py-6 bg-brand-orange text-white rounded-full font-black text-sm text-center shadow-[0_15px_35px_rgba(255,102,0,0.18)] hover:shadow-[0_20px_45px_rgba(10,25,49,0.15)] hover:bg-[#111827] transition-all block uppercase tracking-[0.2em]"
            >
              Solicitar diagnóstico
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href="#servicios" 
              className="px-12 py-6 bg-white border border-gray-100 text-brand-dark rounded-full font-black text-sm text-center shadow-sm hover:shadow-xl transition-all block uppercase tracking-[0.2em]"
            >
              Nuestras áreas
            </motion.a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap items-center gap-10 grayscale"
          >
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]">
              <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
              <span>Sin letra pequeña</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]">
              <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
              <span>Claridad absoluta</span>
            </div>
          </motion.div>
        </div>
        
        <div className="relative">
          <CurtainImageReveal 
            src="/1.png" 
            alt="Asesor Financiero" 
            className="aspect-[4/5] bg-white rounded-[2.5rem] relative border border-gray-100 shadow-[0_32px_64px_rgba(0,0,0,0.06)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.1)] transition-shadow duration-700" 
            delay={0.25}
          />
          
          {/* Stats Floating Card */}
          <motion.div 
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 16, delay: 0.75 }}
            className="absolute -right-4 top-1/2 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hidden lg:block z-30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-orange-light rounded-full flex items-center justify-center text-brand-orange">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brand-gray font-bold">Confianza</p>
                <p className="font-display font-bold text-brand-dark">+10 Años de experiencia</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AuthorityBar = () => {
  const items = [
    { icon: <ShieldCheck size={32} />, title: "Protección Financiera", desc: "Ingresos y futuro familiar" },
    { icon: <Home size={32} />, title: "Hipotecas", desc: "Viabilidad y mejores condiciones" },
    { icon: <HeartPulse size={32} />, title: "Salud Total", desc: "Acceso médico sin esperas" },
    { icon: <PiggyBank size={32} />, title: "Ahorro Activo", desc: "Jubilación y metas a medida" },
  ];

  return (
    <section className="bg-white py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex flex-col items-center text-center gap-4 group cursor-pointer"
            >
              <div className="text-brand-orange bg-brand-orange-light w-16 h-16 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="font-display font-black text-sm uppercase tracking-widest mb-1 group-hover:text-brand-orange transition-colors duration-300">{item.title}</h3>
                <p className="text-brand-gray text-xs font-medium uppercase tracking-wider opacity-60">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  return (
    <CurtainSectionReveal id="problemas" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-orange/3 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <CurtainImageReveal 
              src="/2.png" 
              alt="Finanzas y preocupaciones" 
              className="aspect-square rounded-[3.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.06)] overflow-hidden" 
              delay={0.1}
            />
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.35 }}
              className="absolute bottom-10 left-10 right-10 p-10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-md"
            >
              <p className="text-brand-blue font-serif italic text-2xl leading-relaxed">
                "La mayoría de las personas no planea fracasar, simplemente fracasa en planear."
              </p>
            </motion.div>
          </div>

          <div>
            <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-8 inline-block">El Desafío Actual</span>
            <h2 className="text-5xl md:text-7xl font-serif text-brand-dark mb-10 leading-[1.08] tracking-tighter">
              <CurtainText delay={0.05}>¿Sabes realmente qué pasaría</CurtainText>
              <CurtainText delay={0.12}>
                <span className="italic text-brand-orange font-light">si faltaras mañana?</span>
              </CurtainText>
            </h2>
            <div className="space-y-12">
              {[
                { title: "Incertidumbre financiera", desc: "No tener claro si tus ahorros y seguros son suficientes para mantener el nivel de vida de tu familia." },
                { title: "Vulnerabilidad extrema", desc: "Depender únicamente de un ingreso que, si falla, arrastra consigo la estabilidad del hogar." },
                { title: "Falta de estrategia", desc: "Tomar decisiones financieras basadas en el miedo o en recomendaciones genéricas de bancos." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.15 }}
                  className="flex flex-col gap-2 group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-brand-orange font-serif italic text-5xl opacity-20 shrink-0 tabular-nums transition-opacity duration-300 group-hover:opacity-45">0{i + 1}</span>
                    <h3 className="text-[13px] font-black text-brand-dark uppercase tracking-[0.2em] border-l border-gray-200 pl-6 group-hover:text-brand-orange transition-colors duration-300">{item.title}</h3>
                  </div>
                  <div className="pl-20">
                    <p className="text-brand-gray text-lg font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CurtainSectionReveal>
  );
};

const MethodSection = () => {
  const steps = [
    { title: "1. Analizo tu situación", desc: "Ingresos, gastos, hipoteca, familia, seguros, ahorro y objetivos." },
    { title: "2. Detecto riesgos", desc: "Vemos qué puntos pueden afectar a tu estabilidad financiera real." },
    { title: "3. Ordenamos prioridades", desc: "No todo es urgente. Se decide qué proteger antes de cualquier acción." },
    { title: "4. Propongo soluciones", desc: "Soluciones a medida, solo si encajan con tu caso y aportan valor." },
  ];

  return (
    <CurtainSectionReveal className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-brand-orange font-black uppercase tracking-[0.3em] text-[10.5px] mb-4 inline-block">Plan Metódico</span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-dark mb-4 leading-tight">Primero diagnóstico. Después soluciones.</h2>
          <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 65, damping: 16, delay: i * 0.12 }}
              whileHover={{ y: -6, shadow: "0 25px 45px -15px rgba(0,0,0,0.06)" }}
              className="relative group p-10 rounded-[2rem] bg-gray-50 border border-transparent hover:bg-white hover:border-gray-100 transition-all duration-500 overflow-hidden"
            >
              <span className="absolute -top-4 right-6 text-8xl font-black text-gray-200/30 group-hover:text-brand-orange/10 transition-colors uppercase italic pointer-events-none select-none">
                0{i+1}
              </span>
              <h3 className="font-bold text-2xl mb-5 relative z-10 text-brand-dark group-hover:text-brand-orange transition-colors duration-300">{step.title}</h3>
              <p className="text-brand-gray text-base leading-relaxed relative z-10 font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 45, damping: 16, delay: 0.2 }}
          className="mt-28 text-center"
        >
            <blockquote className="text-2xl md:text-[2.6rem] font-serif font-light text-brand-blue max-w-3xl mx-auto leading-relaxed">
              "No se trata de contratar más. <br className="hidden md:block" />
              <span className="text-brand-orange italic font-normal">Se trata de decidir mejor."</span>
            </blockquote>
        </motion.div>
      </div>
    </CurtainSectionReveal>
  );
};

const BentoServiceCard = ({ id, title, desc, items, icon: Icon, delay, className = "" }: { id?: string, title: string, desc: string, items: string[], icon: any, delay: number, className?: string }) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, y: 35 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10% 0px" }}
    transition={{ type: "spring", stiffness: 55, damping: 16, delay }}
    whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.08)" }}
    className={`bg-white group relative overflow-hidden rounded-[2.5rem] border border-gray-100 p-8 md:p-11 transition-all duration-500 ${className}`}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="w-14 h-14 bg-brand-orange-light rounded-2xl flex items-center justify-center text-brand-orange mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight group-hover:text-brand-orange transition-colors duration-300">{title}</h3>
      <p className="text-brand-gray text-lg mb-8 leading-relaxed font-light">{desc}</p>
      
      <div className="mt-auto space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
            <CheckCircle2 size={16} className="text-brand-orange shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
    
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/6 transition-all duration-500 pointer-events-none"></div>
  </motion.div>
);

const ServicesSection = () => {
  return (
    <CurtainSectionReveal id="servicios" className="py-32 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-brand-orange font-black uppercase tracking-[0.3em] text-sm mb-6 inline-block">Nuestra Pericia</span>
            <h2 className="text-4xl md:text-7xl font-serif leading-[1.08] tracking-tight">
              <CurtainText delay={0.05}>Servicios de</CurtainText>
              <CurtainText delay={0.12}>
                <span className="text-brand-orange italic">protección inteligente</span>
              </CurtainText>
            </h2>
          </div>
          <p className="text-brand-gray text-lg max-w-sm mb-4 leading-relaxed font-light">
            Especializado en blindar tu patrimonio y asegurar que el futuro de tu familia esté siempre bajo control.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <BentoServiceCard 
            id="proteccion" 
            icon={ShieldCheck} 
            title="Protección Familiar" 
            desc="Blindaje de ingresos y estabilidad hogareña ante cualquier imprevisto severo." 
            items={["Seguro de vida", "Incapacidad total", "Protección hogar"]} 
            delay={0}
          />
          <BentoServiceCard 
            id="hipotecas" 
            icon={Home} 
            title="Hipotecas" 
            desc="Análisis técnico para conseguir la mejor financiación del mercado." 
            items={["Viabilidad bancaria", "Mejora de condiciones"]} 
            delay={0.15}
          />
          <BentoServiceCard 
            id="salud" 
            icon={HeartPulse} 
            title="Salud Premium" 
            desc="Acceso preferente a la mejor medicina privada sin esperas ni trabas." 
            items={["Seguro médico total", "Sin copagos", "Especialistas top"]} 
            delay={0.3}
          />
          <BentoServiceCard 
            id="ahorro" 
            icon={PiggyBank} 
            title="Ahorro" 
            desc="Estrategias de inversión y ahorro para jubilación y objetivos a largo plazo." 
            items={["Fondos inversión", "Ahorro infantil", "Plan jubilación"]} 
            delay={0.45}
          />
        </div>
      </div>
    </CurtainSectionReveal>
  );
};

const Audiences = () => {
  return (
    <>
      <CurtainSectionReveal id="autonomos" className="py-32 bg-white scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <CurtainImageReveal 
               src="/3.png" 
               alt="Autónomos" 
               className="rounded-[3rem] shadow-[0_45px_90px_rgba(0,0,0,0.06)] overflow-hidden"
               delay={0.1}
             />
             <motion.div 
                initial={{ rotate: 1, scale: 0.98, opacity: 0 }}
                whileInView={{ rotate: 2, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.35 }}
                className="absolute -bottom-8 -right-8 bg-brand-orange p-10 rounded-3xl text-white shadow-2xl hidden lg:block max-w-sm"
              >
                <p className="font-bold text-2xl italic leading-tight">"Tu protección no puede de ningún modo depender solo de tu facturación."</p>
             </motion.div>
          </div>
          <div>
            <span className="text-brand-orange font-bold text-lg mb-6 inline-block">Freelancers & Autónomos</span>
            <h2 className="text-4xl md:text-[4.8rem] font-serif mb-8 leading-[1.08] tracking-tight italic">
              Si eres autónomo, <br /><span className="text-brand-orange not-italic">tú eres el motor</span>
            </h2>
            <p className="text-brand-gray text-xl mb-10 leading-relaxed font-light">
              Si el motor se para, se para todo. Mi trabajo es asegurarme de que el engranaje financiero y vital de tu negocio siga girando con absoluta precisión.
            </p>
            <ul className="space-y-6 mb-12">
              {[
                "Blindaje de ingresos ante bajas médicas",
                "Protección integral de incapacidad profesional",
                "Estrategia de jubilación real vs. mínima",
                "Seguridad absoluta para tu familia"
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-4 text-brand-dark font-medium"
                >
                  <div className="w-6 h-6 bg-brand-orange-light rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-brand-orange" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href="#diagnostico" 
              className="bg-brand-orange text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors inline-block shadow-lg shadow-brand-orange/15"
            >
              Quiero mi diagnóstico gratuito
            </motion.a>
          </div>
        </div>
      </CurtainSectionReveal>

      <CurtainSectionReveal id="familias" className="py-32 bg-brand-orange-light/35 scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand-blue font-bold text-lg mb-6 inline-block tracking-wide">Bienestar Familiar</span>
            <h2 className="text-4xl md:text-[4.8rem] font-serif mb-8 text-brand-blue leading-[1.08] tracking-tight">
              La familia es <br /><span className="text-brand-orange italic">tu primer legado</span>
            </h2>
            <p className="text-brand-gray text-xl mb-10 leading-relaxed font-light max-w-lg">
              No se trata de miedo, se trata de amor y responsabilidad. Mi meta es que lo peor no rompa el estilo de vida de los que más quieres. Claridad, previsión y paz mental.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {["Control de hipoteca", "Protección imprevistos", "Salud sin esperas", "Futuro de los hijos"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-brand-blue font-bold">
                  <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href="#diagnostico" 
              className="bg-brand-blue text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-orange transition-colors inline-block shadow-xl shadow-brand-blue/15"
            >
              Revisar protección familiar
            </motion.a>
          </div>
          <div className="relative">
            <CurtainImageReveal 
              src="/4.png" 
              alt="Familia" 
              className="rounded-[3rem] shadow-2xl overflow-hidden relative"
              delay={0.15}
            />
            <div className="absolute -inset-4 border-2 border-brand-orange/20 rounded-[3.5rem] -rotate-3 z-0 pointer-events-none"></div>
          </div>
        </div>
      </CurtainSectionReveal>
    </>
  );
};

const DiagnosisForm = () => {
  return (
    <section id="diagnostico" className="py-40 bg-brand-dark relative overflow-hidden">
      {/* Subtle blurs (lights) */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          >
            <span className="text-brand-orange font-black uppercase tracking-[0.3em] text-[10px] mb-8 inline-block">Comienza el Cambio</span>
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-12 leading-[0.92] tracking-tighter">
              Solicita tu <br /><span className="text-brand-orange italic font-light">diagnóstico</span>
            </h2>
            <p className="text-gray-400 text-xl md:text-2xl mb-16 leading-relaxed font-light">
              Es una conversación de claridad. Detectaremos fugas en tu protección actual y trazaremos un plan táctico para blindar tu futuro.
            </p>
            
            <div className="space-y-14">
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-2xl">
                  <Phone size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">WhatsApp Directo</p>
                  <p className="text-white text-3xl font-light tracking-tight">+34 600 000 000</p>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-2xl">
                  <Mail size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Email Profesional</p>
                  <p className="text-white text-3xl font-light tracking-tight">hola@josecarloshidalgo.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 16, delay: 0.15 }}
            className="bg-white p-10 md:p-20 rounded-[4rem] shadow-[0_45px_90px_rgba(0,0,0,0.3)] relative"
          >
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray ml-2">Nombre Completo</label>
                  <input type="text" placeholder="Ej. Juan Pérez" className="w-full bg-[#F5F5F7] border-0 rounded-2xl p-6 text-brand-dark focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-300 font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray ml-2">WhatsApp</label>
                  <input type="tel" placeholder="+34 000 000 000" className="w-full bg-[#F5F5F7] border-0 rounded-2xl p-6 text-brand-dark focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-300 font-medium" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray ml-2">Tu principal preocupación</label>
                <div className="relative">
                  <select className="w-full bg-[#F5F5F7] border-0 rounded-2xl p-6 text-brand-dark focus:ring-2 focus:ring-brand-orange outline-none transition-all appearance-none cursor-pointer font-medium">
                    <option>Diagnóstico Integral (Recomendado)</option>
                    <option>Protección Familia y Vivienda</option>
                    <option>Estrategia para Autónomos</option>
                    <option>Ahorro e Inversión</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray ml-2">Mensaje (Opcional)</label>
                <textarea rows={3} placeholder="Cuéntame brevemente tu caso..." className="w-full bg-[#F5F5F7] border-0 rounded-3xl p-6 text-brand-dark focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-300 resize-none font-medium"></textarea>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className="w-full py-8 bg-brand-dark text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-brand-orange transition-all duration-300 cursor-pointer"
              >
                Solicitar Diagnóstico
              </motion.button>
              <div className="flex items-center justify-center gap-2 grayscale opacity-30 mt-4 font-black text-[9px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-dark"></div>
                <span>Privacidad Asegurada</span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "¿Qué coste tiene el diagnóstico?", a: "Absolutamente ninguno. Es una inversión de mi tiempo para entender si mi metodología puede aportarte el valor que buscas." },
    { q: "¿Qué ocurre tras la reunión?", a: "Saldrás con una hoja de ruta clara. Tú decides si quieres implementar las mejoras por tu cuenta o si deseas que te acompañe en el proceso." },
    { q: "¿Necesito preparar algo?", a: "Solo tus cifras aproximadas y tus dudas. Mi trabajo es simplificar la complejidad, no pedirte que hagas el trabajo técnico por mí." },
    { q: "¿La consulta es presencial?", a: "Operamos principalmente mediante videoconferencia de alta resolución, lo que nos permite una flexibilidad total y un análisis compartido de datos en tiempo real." },
  ];

  return (
    <section className="py-40 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-6 inline-block">Resolviendo Dudas</span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-dark italic">
            Preguntas <span className="text-brand-orange not-italic">Frecuentes</span>
          </h2>
        </div>
        <div className="border-t border-gray-100">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutMe = () => {
  return (
    <CurtainSectionReveal id="sobre-mi" className="py-32 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="w-full lg:w-1/2">
             <div className="relative inline-block w-full">
                <motion.div 
                  initial={{ scale: 0.8, rotate: 0 }}
                  whileInView={{ scale: 1, rotate: -3 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  className="absolute -inset-4 bg-brand-orange rounded-[3rem] -z-10 opacity-10"
                ></motion.div>
                <CurtainImageReveal 
                  src="/5.png" 
                  alt="Consultoría financiera especializada" 
                  className="rounded-[3rem] w-full relative z-10 shadow-2xl" 
                  delay={0.1}
                />
             </div>
          </div>
          <div>
            <span className="text-brand-orange font-black uppercase tracking-[0.3em] text-sm mb-6 inline-block">Consultoría con Valores</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-10 leading-[1.08] tracking-tight">Humanizando las <br/><span className="text-brand-orange italic">decisiones financieras</span></h2>
            <p className="text-brand-gray text-2xl mb-8 leading-relaxed font-light">
              Mi enfoque es sencillo: antes de recomendar una solución, hay que entender bien el alma de cada situación.
            </p>
            <p className="text-brand-gray text-xl mb-12 leading-relaxed font-light">
              Analizo ingresos, cargas, riesgos y objetivos para que cada decisión tenga un sentido lógico y emocional. Mi meta es que protejas lo que más importa con criterio profesional y absoluta tranquilidad.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
               <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="p-6 bg-gray-50 rounded-3xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-lg transition-all"
               >
                  <p className="text-brand-orange font-bold text-3xl mb-2 italic tracking-tighter">Cercanía</p>
                  <p className="text-xs text-brand-gray uppercase font-black tracking-widest opacity-60">Atención 1 a 1</p>
               </motion.div>
               <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="p-6 bg-gray-50 rounded-3xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-lg transition-all"
               >
                  <p className="text-brand-blue font-bold text-3xl mb-2 italic tracking-tighter">Ética</p>
                  <p className="text-xs text-brand-gray uppercase font-black tracking-widest opacity-60">Claridad Total</p>
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </CurtainSectionReveal>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-40 bg-brand-dark text-white relative overflow-hidden">
       {/* Background Image /6.png with dark premium overlay */}
       <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay pointer-events-none">
         <img src="/6.png" className="w-full h-full object-cover" alt="Contacto" referrerPolicy="no-referrer" />
       </div>
       {/* High-end glow lights */}
       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/6 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/4 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
       
       <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
          >
            <h2 className="text-6xl md:text-9xl font-serif mb-16 leading-[0.88] tracking-tighter">
              <CurtainText delay={0.05} className="text-center w-full">El control</CurtainText>
              <span className="text-brand-orange italic font-light whitespace-nowrap block mt-2">es el nuevo lujo</span>
            </h2>
            <p className="text-gray-400 text-xl md:text-3xl mb-20 max-w-3xl mx-auto leading-relaxed font-light">
              Toma hoy la decisión que definirá la tranquilidad de tu familia en los próximos 20 años.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
               <motion.a 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 350, damping: 16 }}
                href="#diagnostico" 
                className="w-full sm:w-auto bg-brand-orange text-white px-16 py-8 rounded-full font-black text-xs hover:shadow-[0_22px_55px_rgba(255,102,0,0.3)] transition-all uppercase tracking-[0.4em] text-center block"
               >
                  Quiero mi Diagnóstico
               </motion.a>
               <motion.a 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 350, damping: 16 }}
                href="https://wa.me/34600000000" 
                target="_blank" 
                className="w-full sm:w-auto bg-white/5 backdrop-blur-xl text-white border border-white/10 px-16 py-8 rounded-full font-black text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-center"
               >
                  WhatsApp
               </motion.a>
            </div>
          </motion.div>
       </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-dark py-40 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-24 items-start mb-32">
          <div className="col-span-2">
            <div className="flex items-center gap-5 mb-12">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                    <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" referrerPolicy="no-referrer" />
                </div>
            </div>
            <p className="text-gray-400 text-xl max-w-sm leading-relaxed mb-12 font-light">
              Asesoramiento financiero de alta gama. Protegiendo el legado de los que más quieres con estrategia y claridad.
            </p>
            <div className="flex gap-6">
              {[Mail, Phone].map((Icon, i) => (
                  <motion.a 
                    key={i} 
                    whileHover={{ scale: 1.08, backgroundColor: "#FF6600", borderColor: "#FF6600", color: "#ffffff" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    href="#" 
                    className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center text-white bg-white/5"
                  >
                    <Icon size={24} />
                  </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-white uppercase tracking-[0.3em] text-[10px] mb-10">Navegación</h4>
            <ul className="space-y-6 text-gray-400 font-light text-lg">
              {["Servicios", "Autónomos", "Familias", "Sobre mí", "Contacto"].map(item => (
                <li key={item}><a href={`#${item.toLowerCase()}`} className="hover:text-brand-orange transition-colors duration-300">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-[0.3em] text-[10px] mb-10">Legal</h4>
            <ul className="space-y-6 text-gray-400 font-light text-lg">
              {["Aviso Legal", "Privacidad", "Cookies", "Términos"].map(item => (
                <li key={item}><a href="#" className="hover:text-brand-orange transition-colors duration-300">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-8">
          <p className="text-gray-500 text-sm font-light">
            © {new Date().getFullYear()} La excelencia en previsión social.
          </p>
          <div className="flex items-center gap-3 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] grayscale">
            <span>Hecho con</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
            <span>Valencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

export default function App() {
  // Initialize premium Lenis Smooth Scrolling with physics curves
  useSmoothScroll();

  return (
    <div className="min-h-screen selection:bg-brand-orange/20 selection:text-brand-orange font-sans bg-white antialiased">
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <AuthorityBar />
        <ProblemSection />
        <MethodSection />
        <ServicesSection />
        <Audiences />
        <AboutMe />
        <DiagnosisForm />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
