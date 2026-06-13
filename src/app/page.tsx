import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="font-bold text-xl tracking-tight">Contabilidad con María</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#servicios" className="hover:text-brand-600 transition-colors">Servicios</a>
            <a href="#nosotros" className="hover:text-brand-600 transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-brand-600 transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/portal" 
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 px-5 rounded-md transition-all shadow-sm hover:shadow active:scale-95"
            >
              Acceso a Clientes
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-50 via-white to-white dark:from-brand-900/20 dark:via-background dark:to-background -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-brand-600 bg-brand-50 ring-1 ring-inset ring-brand-600/20 mb-6 dark:bg-brand-500/10 dark:text-brand-400">
                  Asesoría Tributaria y Contable
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                  Tu contabilidad en orden, <span className="text-brand-600">sin estrés.</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-[65ch] leading-relaxed">
                  Delegar tus finanzas no debería ser un dolor de cabeza. Ofrecemos servicios contables, remuneraciones y asesoría tributaria para pequeñas y medianas empresas. Además, accede a todos tus documentos al instante con nuestro nuevo portal de clientes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#contacto" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-base font-semibold py-3 px-6 rounded-md transition-all active:scale-95">
                    Agenda una asesoría
                  </a>
                  <a href="#servicios" className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-base font-semibold py-3 px-6 rounded-md transition-all">
                    Ver servicios
                  </a>
                </div>
              </div>
              
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                {/* Abstract graphic representing the portal / documents */}
                <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
                  {/* Fake UI header */}
                  <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-50 dark:bg-slate-950/50">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-6 flex-1 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                      <div className="h-10 w-32 bg-brand-600 rounded-md"></div>
                    </div>
                    
                    {/* Fake documents */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          </div>
                          <div>
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-1.5"></div>
                            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                          </div>
                        </div>
                        <div className="h-8 w-24 border border-slate-200 dark:border-slate-700 rounded-md hidden sm:block"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">F29 Declarado</p>
                      <p className="text-sm text-slate-500">Periodo actual al día</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Servicios integrales para tu empresa
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Nos encargamos de los números para que tú te enfoques en hacer crecer tu negocio. Soluciones personalizadas para cada necesidad.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Contabilidad Mensual', desc: 'Llevanza de libros contables, balances y estados de resultados con total transparencia.', icon: 'M4 19h16v2H4zm2-4h12v2H6zm0-4h12v2H6zm0-4h12v2H6z' },
                { title: 'Declaración de Impuestos', desc: 'Formulario 29, declaraciones juradas y renta anual. Cumple con el SII sin retrasos ni multas.', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
                { title: 'Remuneraciones', desc: 'Cálculo de sueldos, finiquitos, cotizaciones previsionales (Previred) y contratos laborales.', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 flex items-center justify-center mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.icon}></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portal Highlight */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-600 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-xl text-white">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Todo tu papeleo, en un solo lugar.
                </h2>
                <p className="text-brand-100 text-lg mb-8">
                  Nuestros clientes tienen acceso a un portal exclusivo. Descarga tus balances, revisa tus liquidaciones de sueldo y comprueba el pago de tus impuestos 24/7 sin tener que mandar un solo correo.
                </p>
                <Link 
                  href="/portal" 
                  className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Probar el portal
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
              
              <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-white">
                <div className="font-semibold text-lg mb-4">Documentos Recientes</div>
                <div className="space-y-3">
                  {['Balance General 2025.pdf', 'F29_Marzo.pdf', 'Liquidaciones_Abril.zip'].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contacto" className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="font-bold text-xl text-white">Contabilidad con María</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Soluciones contables, tributarias y laborales para empresas que buscan crecer de manera ordenada.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Oficina Central, Ciudad</li>
              <li>📧 contacto@contabilidadconmaria.cl</li>
              <li>📞 +56 9 1234 5678</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/portal" className="hover:text-white transition-colors">Portal de Clientes</Link></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Nuestros Servicios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 Contabilidad con María. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
