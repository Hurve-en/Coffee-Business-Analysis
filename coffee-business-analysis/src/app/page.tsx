import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Coffee, TrendingUp, DollarSign, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(184,134,11,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <Coffee className="w-4 h-4" />
              <span>Brew Better Business Decisions</span>
            </div>
          </div>

          <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 animate-slide-up">
            Transform Your
            <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent animate-slide-up-delay-1">
              Coffee Business
            </span>
          </h1>

          <p className="text-center text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up-delay-2">
            Comprehensive analytics and insights to help you make data-driven decisions, 
            track performance, and grow your coffee venture with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay-3">
            <Link 
              href="/dashboard/overview"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link 
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for coffee businesses to track, analyze, and optimize operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Sales Analytics"
              description="Track revenue trends, identify peak hours, and monitor sales performance across all products and categories."
              gradient="from-blue-500 to-cyan-500"
              delay="0ms"
            />

            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Customer Insights"
              description="Understand customer behavior, track loyalty points, and identify your most valuable customers."
              gradient="from-purple-500 to-pink-500"
              delay="100ms"
            />

            <FeatureCard
              icon={<Coffee className="w-8 h-8" />}
              title="Product Performance"
              description="Monitor inventory levels, analyze product profitability, and optimize your menu offerings."
              gradient="from-amber-500 to-orange-500"
              delay="200ms"
            />

            <FeatureCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Financial Reports"
              description="Generate detailed P&L statements, track expenses, and monitor cash flow with ease."
              gradient="from-green-500 to-emerald-500"
              delay="300ms"
            />

            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Real-time Dashboard"
              description="Get instant access to key metrics and KPIs with beautiful, interactive visualizations."
              gradient="from-indigo-500 to-blue-500"
              delay="400ms"
            />

            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Market Research"
              description="Document findings, track trends, and make informed strategic decisions based on data."
              gradient="from-rose-500 to-red-500"
              delay="500ms"
            />

          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            
            <div className="animate-fade-in-up">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-amber-100 text-lg">Orders Tracked</div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-amber-100 text-lg">Products Analyzed</div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-amber-100 text-lg">Customer Satisfaction</div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join successful coffee entrepreneurs using data to make better decisions.
          </p>
          <Link 
            href="/dashboard/overview"
            className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>

    </main>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient,
  delay 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  delay: string
}) {
  return (
    <div 
      className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-amber-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-5 h-5 text-amber-600" />
      </div>
    </div>
  )
}