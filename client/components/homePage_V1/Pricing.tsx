const Pricing = () => {
    return (
        <section id="pricing" className="py-20 bg-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate__animated animate__fadeIn">
                <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-400">Choose the perfect plan for your time management needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-neutral-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInLeft">
                <h3 className="text-2xl font-bold text-white mb-4">Basic</h3>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">$9</span>
                    <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic time tracking
                    </li>
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Daily goals setting
                    </li>
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic AI insights
                    </li>
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Email support
                    </li>
                </ul>
                <button className="w-full bg-neutral-700 text-white py-3 px-6 rounded-lg hover:bg-neutral-600 transition-colors duration-300">
                    Start Free Trial
                </button>
                </div>

                <div className="bg-indigo-600 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform scale-105 animate__animated animate__fadeInUp">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">Pro</h3>
                    <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
                </div>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">$19</span>
                    <span className="text-indigo-200">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-white">
                    <svg className="w-5 h-5 text-indigo-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Advanced time tracking
                    </li>
                    <li className="flex items-center text-white">
                    <svg className="w-5 h-5 text-indigo-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Daily &amp; Weekly goals
                    </li>
                    <li className="flex items-center text-white">
                    <svg className="w-5 h-5 text-indigo-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Full AI insights &amp; analysis
                    </li>
                    <li className="flex items-center text-white">
                    <svg className="w-5 h-5 text-indigo-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority support
                    </li>
                </ul>
                <button className="w-full bg-white text-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                    Get Started
                </button>
                </div>
                <div className="bg-neutral-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInRight">
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">$49</span>
                    <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Unlimited tracking
                    </li>
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    All goals features
                    </li>
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Custom AI solutions
                    </li>
                    <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    24/7 dedicated support
                    </li>
                </ul>
                <button className="w-full bg-neutral-700 text-white py-3 px-6 rounded-lg hover:bg-neutral-600 transition-colors duration-300">
                    Contact Sales
                </button>
                </div>
            </div>

            <div className="mt-16 text-center animate__animated animate__fadeIn">
                <p className="text-gray-400 mb-4">All plans include a 14-day free trial. No credit card required.</p>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">View full comparison table</a>
            </div>
            </div>
        </section>
    )
}   

export default Pricing;