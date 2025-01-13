const Insights = () => {
    return (
        <section id="aiInsights" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 animate__animated animate__fadeIn">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Time Management Insights</h2>
        <p className="text-xl text-gray-600">Let our AI analyze your patterns and optimize your productivity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="animate__animated animate__fadeInLeft">
          <div className="bg-neutral-900 rounded-xl p-6 shadow-xl">
            <div className="bg-neutral-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-bold">Weekly Time Analysis</h3>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">AI Generated</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Productive Hours</span>
                    <span className="text-green-400">32.5 hrs</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: "85%"}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Focus Time</span>
                    <span className="text-indigo-400">28.2 hrs</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{width: "75%"}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Break Time</span>
                    <span className="text-purple-400">12.3 hrs</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: "65%"}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">AI Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Consider taking shorter, more frequent breaks to maintain higher productivity levels.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Your peak productivity hours are between 9 AM and 11 AM. Schedule important tasks during this time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8 lg:mt-12 animate__animated animate__fadeInRight">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pattern Recognition</h3>
              <p className="text-gray-600">Our AI analyzes your work patterns to identify peak productivity hours and potential time-wasters.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Predictions</h3>
              <p className="text-gray-600">Get accurate predictions about goal completion based on your current pace and historical data.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Recommendations</h3>
              <p className="text-gray-600">Receive custom-tailored suggestions to optimize your schedule and improve productivity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    )
};

export default Insights;