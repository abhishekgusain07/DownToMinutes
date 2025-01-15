const GoalTracking = () => {
    return (
        <section id="goalTracking" className="py-20 bg-neutral-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 animate__animated animate__fadeIn">
        <h2 className="text-4xl font-bold text-white mb-4">Smart Goal Tracking</h2>
        <p className="text-xl text-gray-400">Set, track, and achieve your goals with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInLeft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Daily Goals</h3>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">On Track</span>
          </div>
          <div className="space-y-4">
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Coding Practice</span>
                <span className="text-green-400">2/3 hrs</span>
              </div>
              <div className="w-full bg-neutral-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: "66%"}}></div>
              </div>
            </div>
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Reading</span>
                <span className="text-yellow-400">30/60 min</span>
              </div>
              <div className="w-full bg-neutral-600 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: "50%"}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Weekly Goals</h3>
            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">In Progress</span>
          </div>
          <div className="space-y-4">
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Project Completion</span>
                <span className="text-indigo-400">15/20 hrs</span>
              </div>
              <div className="w-full bg-neutral-600 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{width: "75%"}}></div>
              </div>
            </div>
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Learning Goals</span>
                <span className="text-indigo-400">8/10 hrs</span>
              </div>
              <div className="w-full bg-neutral-600 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{width: "80%"}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInRight">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Quarterly Goals</h3>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">Planning</span>
          </div>
          <div className="space-y-4">
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Skill Development</span>
                <span className="text-purple-400">25/100 hrs</span>
              </div>
              <div className="w-full bg-neutral-600 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: "25%"}}></div>
              </div>
            </div>
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Portfolio Projects</span>
                <span className="text-purple-400">2/8 completed</span>
              </div>
              <div className="w-full bg-neutral-600 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: "25%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-neutral-800 rounded-xl p-8 animate__animated animate__fadeInUp">
        <h3 className="text-2xl font-bold text-white mb-6">AI Goal Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Progress Analysis</h4>
              <p className="text-gray-400 text-sm">You're 15% ahead of schedule on weekly goals</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Time Prediction</h4>
              <p className="text-gray-400 text-sm">Estimated completion: 2 weeks ahead of schedule</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Optimization Tips</h4>
              <p className="text-gray-400 text-sm">Consider allocating more time to skill development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    );
};

export default GoalTracking;