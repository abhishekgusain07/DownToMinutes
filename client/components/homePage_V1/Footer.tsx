const Footer = () => {
    return (
        <footer id="footer" className="bg-neutral-900 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="animate__animated animate__fadeIn">
                <h3 className="text-2xl font-bold text-white mb-4">TimeAI</h3>
                <p className="text-gray-400 mb-6">Empowering individuals and teams to achieve more through AI-powered time management.</p>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                    </a>
                </div>
                </div>
                <div className="animate__animated animate__fadeIn">
                <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-3">
                    <li><a href="#hero" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Home</a></li>
                    <li><a href="#features" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Features</a></li>
                    <li><a href="#pricing" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Pricing</a></li>
                    <li><a href="#testimonials" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Testimonials</a></li>
                    <li><a href="#contact" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Contact</a></li>
                </ul>
                </div>
                <div className="animate__animated animate__fadeIn">
                <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
                <ul className="space-y-3">
                    <li><a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Time Tracking</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">AI Insights</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Goal Setting</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Progress Analytics</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">Reporting</a></li>
                </ul>
                </div>
                <div className="animate__animated animate__fadeIn">
                <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                <ul className="space-y-3">
                    <li className="text-gray-400">
                    <span className="block">123 Innovation Street</span>
                    <span className="block">Tech City, TC 12345</span>
                    </li>
                    <li>
                    <a href="tel:+15551234567" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">+1 (555) 123-4567</a>
                    </li>
                    <li>
                    <a href="mailto:support@timeai.com" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">support@timeai.com</a>
                    </li>
                </ul>
                </div>
            </div>

            <div className="border-t border-neutral-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 TimeAI. All rights reserved.</p>
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-indigo-500 text-sm transition-colors duration-300">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-indigo-500 text-sm transition-colors duration-300">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-indigo-500 text-sm transition-colors duration-300">Cookie Policy</a>
                </div>
                </div>
            </div>
            </div>
        </footer>
    )
}
export default Footer;