"use client";
import React, { useState } from 'react';
const Faq = () => {
    const [isActive, setIsActive] = useState(false);
    const [rotateIcon, setRotateIcon] = useState(false);

    const handleToggle = (event: React.MouseEvent) => {
        setIsActive(!isActive);
        setRotateIcon(!rotateIcon);
    };

    // const handleOtherToggles = (event: React.MouseEvent) => {
    //     const otherToggles = document.querySelectorAll('.faq-toggle');
    //     otherToggles.forEach(otherToggle => {
    //         if (otherToggle !== event.target) {
    //             const otherContent = otherToggle.nextElementSibling;
    //             const otherIcon = otherToggle.querySelector('.faq-icon');
    //             otherContent?.classList.add('hidden');
    //             otherIcon?.style?.transform = 'rotate(0deg)';
    //         }
    //     });
    // };

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate__animated animate__fadeIn">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600">Get answers to common questions about TimeAI</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="border border-gray-200 rounded-lg animate__animated animate__fadeInUp">
                        <button className="faq-toggle w-full flex justify-between items-center p-4 focus:outline-none" onClick={handleToggle}>
                            <span className="text-lg font-semibold text-gray-900">How does the AI-powered insight system work?</span>
                            <svg className="faq-icon w-6 h-6 text-gray-500 transform transition-transform duration-200" style={{transform: rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div className={`faq-content p-4 pt-0 text-gray-600 ${isActive ? '' : 'hidden'}`}>
                            Our AI analyzes your time-tracking data, identifies patterns, and provides personalized recommendations. It learns from your habits and goals to offer increasingly accurate insights and predictions about your productivity trends.
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg animate__animated animate__fadeInUp">
                        <button className="faq-toggle w-full flex justify-between items-center p-4 focus:outline-none" onClick={handleToggle}>
                            <span className="text-lg font-semibold text-gray-900">Can I track multiple projects simultaneously?</span>
                            <svg className="faq-icon w-6 h-6 text-gray-500 transform transition-transform duration-200" style={{transform: rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div className={`faq-content hidden p-4 pt-0 text-gray-600 ${isActive ? '' : 'hidden'}`}>
                            Yes, TimeAI allows you to track multiple projects and goals simultaneously. You can categorize your activities and receive specific insights for each project or category.
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg animate__animated animate__fadeInUp">
                        <button className="faq-toggle w-full flex justify-between items-center p-4 focus:outline-none" onClick={handleToggle}>
                            <span className="text-lg font-semibold text-gray-900">How accurate are the AI predictions?</span>
                            <svg className="faq-icon w-6 h-6 text-gray-500 transform transition-transform duration-200" style={{transform: rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div className={`faq-content hidden p-4 pt-0 text-gray-600 ${isActive ? '' : 'hidden'}`}>
                            Our AI system has shown 90%+ accuracy in predicting goal completion rates based on current progress and historical data. The accuracy improves over time as it learns from your patterns.
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg animate__animated animate__fadeInUp">
                        <button className="faq-toggle w-full flex justify-between items-center p-4 focus:outline-none" onClick={handleToggle}>
                            <span className="text-lg font-semibold text-gray-900">Can I export my time tracking data?</span>
                            <svg className="faq-icon w-6 h-6 text-gray-500 transform transition-transform duration-200" style={{transform: rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div className={`faq-content hidden p-4 pt-0 text-gray-600 ${isActive ? '' : 'hidden'}`}>
                            Yes, you can export your data in various formats including CSV, PDF, and Excel. This makes it easy to integrate with other tools or create custom reports.
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg animate__animated animate__fadeInUp">
                        <button className="faq-toggle w-full flex justify-between items-center p-4 focus:outline-none" onClick={handleToggle}>
                            <span className="text-lg font-semibold text-gray-900">Is my data secure and private?</span>
                            <svg className="faq-icon w-6 h-6 text-gray-500 transform transition-transform duration-200" style={{transform: rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div className={`faq-content hidden p-4 pt-0 text-gray-600 ${isActive ? '' : 'hidden'}`}>
                            We take data security seriously. All data is encrypted both in transit and at rest, and we follow industry-best security practices. We never share your personal data with third parties.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Faq;