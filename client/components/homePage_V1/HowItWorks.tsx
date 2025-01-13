const HowItWorks = () =>  {
    return (
        <section id="howItWorks" className="py-20 bg-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate__animated animate__fadeIn">
                <h2 className="text-4xl font-bold text-white mb-4">How TimeAI Works</h2>
                <p className="text-xl text-gray-400">Follow these simple steps to master your time management</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-indigo-500"/>
                <div className="relative bg-neutral-800 rounded-xl p-8 animate__animated animate__fadeInLeft">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">1</div>
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Log Your Activities</h3>
                    <div className="h-32 w-32 mx-auto bg-neutral-700 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    </div>
                    <p className="text-gray-400">Simply input your daily activities with duration. Track everything from work to leisure.</p>
                </div>
                </div>

                {/* TODO: add adnimation-delay of 0.2 sec in below div */}
                <div className="relative bg-neutral-800 rounded-xl p-8 animate__animated animate__fadeIn">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">2</div>
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Set Your Goals</h3>
                    <div className="h-32 w-32 mx-auto bg-neutral-700 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    </div>
                    <p className="text-gray-400">Define your daily, weekly, and quarterly goals with specific time allocations.</p>
                </div>
                </div>

                {/* TODO: add adnimation-delay of 0.2 sec in below div */}
                <div className="relative bg-neutral-800 rounded-xl p-8 animate__animated animate__fadeInRight">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">3</div>
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Get AI Insights</h3>
                    <div className="h-32 w-32 mx-auto bg-neutral-700 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    </div>
                    <p className="text-gray-400">Receive personalized AI analysis and recommendations to optimize your time usage.</p>
                </div>
                </div>
            </div>

            <div className="mt-16 text-center">
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg transform transition duration-300 hover:scale-105 animate__animated animate__fadeInUp">
                Start Tracking Now
                </button>
            </div>
            </div>
        </section>
    )
}
export default HowItWorks;
