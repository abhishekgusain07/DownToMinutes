
// import {uid }from "uid";
// console.log(uid(32))


// // const {

// //     GoogleGenerativeAI,
// //     HarmCategory,
// //     HarmBlockThreshold,
// //   } = require("@google/generative-ai");
  
// //   const apiKey = process.env.GEMINI_API_KEY;
// //   const genAI = new GoogleGenerativeAI(apiKey);
  
// //   const model = genAI.getGenerativeModel({
// //     model: "gemini-2.0-flash",
// //   });
  
// //   const generationConfig = {
// //     temperature: 1,
// //     topP: 0.95,
// //     topK: 40,
// //     maxOutputTokens: 8192,
// //     responseMimeType: "text/plain",
// //   };
  
// //   async function run() {
// //     const chatSession = model.startChat({
// //       generationConfig,
// //       history: [
// //       ],
// //     });
  
// //     const result = await chatSession.sendMessage(`Summarize the following text in one sentence:  Good morning, AI enthusiasts. Google’s latest answer in the AI model race just landed, and it’s bringing a whole family of new models to the scene.

// // But with OpenAI’s buzzy o3 grabbing headlines and 2.0 Pro’s modest benchmark gains, can these new releases keep Google’s December hype train rolling?

// // Speaking of o3… OpenAI recently launched ‘Deep Research’ — and our next workshop on Friday will teach you how to leverage this powerful new tool (and take advantage of free alternatives). Learn more and register here.

// // In today’s AI rundown:

// // Google rolls out Gemini 2.0 lineup with Pro

// // Nvidia's AI teaches robots to move like athletes

// // How to research and validate business ideas with AI

// // OpenAI signals hardware push with trademark filing

// // 4 new AI tools & 4 job opportunities

// // LATEST DEVELOPMENTS

// // GOOGLE
// // ✨ Google rolls out Gemini 2.0 lineup with Pro

// // Image source: Google

// // The Rundown: Google just unveiled several new AI models in its Gemini 2.0 lineup, including the highly anticipated Pro Experimental and the cost-efficient Flash and Flash Lite, which also makes its Flash Thinking reasoning model available to all app users.

// // The details:

// // 2.0 Pro Exp. features a massive 2M token context window and excels at coding tasks, with enhanced capabilities for complex prompts and world knowledge.

// // A new budget-friendly 2.0 Flash-Lite model delivers better performance than 1.5 Flash while maintaining the same speed and pricing.

// // The 2.0 Flash Thinking Experimental reasoning model is now freely available in the Gemini app, showing users step-by-step thought processes in real time.

// // All new models feature multimodal input capabilities, with outputs like image generation and text-to-speech planned for release in the coming months.

// // Why it matters: Google has officially made the leap many were waiting for with its flagship 2.0 Pro model — but unlike the high-powered December releases that were major steps up on the competition, 2.0 Pros benchmarks look a bit underwhelming compared to both 1.5 Pro and the current hype surrounding OpenAI’s latest releases.

// // TOGETHER WITH SANA
// // 🤝 Bring AI to every team with Sana

// // The Rundown: Sana AI turns your organization’s knowledge into powerful, secure AI agents — enabling you to launch game-changing AI across every team in minutes, not months.

// // With Sana, you can:

// // Deploy custom AI agents for any role without writing a single line of code

// // Unify AI across your organization and create a consistent user experience

// // Seamlessly Integrate into existing tools and data sources with enterprise-ready security

// // Learn more about Sana AI and drive enterprise-wide innovation today.

// // NVIDIA
// // 🏀 Nvidia's AI teaches robots to move like athletes

// // Image source: Nvidia

// // The Rundown: Nvidia and Carnegie Mellon researchers just introduced ASAP, an AI framework that lets humanoid robots learn complex movements from simulations — enabling the replication of iconic celebrations and moves from professional athletes.

// // The details:

// // The system works in two stages: initial training in simulation followed by a specialized neural network that adapts movements for real-world physics.

// // Unitree G1 robots demonstrated complex motions in testing, including recreating moves from athletes like LeBron James and Cristiano Ronaldo.

// // The framework reduced motion errors by 53% compared to existing methods — a major advance in bridging the gap between virtual and physical training.

// // Hardware limitations remain challenging, with two test robots suffering damage from overheated motors during high-intensity movements.

// // Why it matters: The acceleration in robotic movement capabilities over the last year has been mind-blowing—and what better way to show it than through some of the world's most iconic celebrations? As training gets faster and more efficient, the next step may be for robots to take the actual field in leagues of their own.

// // Check out video footage of the movements here.

// // AI TRAINING
// // 🔍 Research and validate business ideas with AI

// // The Rundown: In this tutorial, you’ll learn how to use Perplexity with the new DeepSeek model to rapidly validate business ideas by analyzing market opportunities, competition, and viability.

// // Step-by-step:

// // Enable Perplexity Pro and DeepSeek reasoning (5 free daily searches for new users).

// // Provide your business idea and ask to analyze market fundamentals with targeted prompts.

// // Request to research competition and revenue models and create your validation roadmap using its insights.

// // Pro tip: Use your free DeepSeek searches strategically - save them for complex queries that require advanced reasoning rather than basic market data. The Rundown University members can also access our pre-written prompts here.

// // PRESENTED BY INNOVATING WITH AI
// // 🤝 Turn AI passion into a consulting career

// // The Rundown: Innovating with AI's new program, AI Consultancy Project, transforms AI enthusiasts into professional consultants — tapping into a market projected to reach $54.7B by 2032.

// // The 6-month program delivers:

// // Proven frameworks for client acquisition and service delivery

// // A step-by-step path to six-figure consulting income

// // Students who land their first AI client in as little as 3 days

// // Click here to request early access to The AI Consultancy Project.

// // OPENAI
// // 📱 OpenAI signals hardware push with trademark filing

// // Image source: Grok / The Rundown

// // The Rundown: OpenAI just filed a trademark application covering everything from humanoid robots to AI wearables, hinting at ambitions to move into physical products through partnerships with hardware veterans like former Apple designer Jony Ive.

// // The details:

// // The application includes smart jewelry, VR/AR headsets, wearables for ‘AI-assisted interaction,’ smartwatches, and more.

// // Also listed are ‘user-programmable humanoid robots’ and robots with ‘communication and learning functions for assisting and entertaining people.’

// // OpenAI has frequently been linked to Jony Ive, with Sam Altman reiterating that he hopes to create an AI-first phone ‘in partnership’ with him last week.

// // The company recently began rebuilding its robotics team, with Figure AI also abruptly ending its collaboration agreement with OpenAI this week.

// // Why it matters: While competing in consumer hardware would’ve felt insane a few years ago, Apple’s turbulent rollout of AI and unprecedented growth of OpenAI could offer a new window of opportunity. Altman has also said that AI advances warrant a “new kind of hardware” — and maybe humanoids are that final form he envisions.

// // QUICK HITS

// // 🛠️ Trending AI Tools
// // 🎉 Invites - Apple’s AI-powered party planning tool

// // ⚡️ Livekit - New open-source turn detection model for natural voice AI

// // ⚙️ a0 Dev - Generate full mobile apps with AI in minutes

// // 💬 Chatbase - AI agents for magical customer experiences

// // 💼 AI Job Opportunities
// // 🎯 The Rundown - Marketing/Media Buyer

// // 🧵 Figure AI - Senior Soft Goods Engineer, TeleOp

// // 🤝 Databricks - Business Development Representative

// // 🚀 Luma AI - Growth Marketer

// // 📰 Everything else in AI today
// // Free 1-hour AI workshop: Get proficient in prompting, learn solid AI use cases, and get confident using AI in just one hour with Section. Enroll for free.*

// // Google revised its AI ethics principles to remove restrictions on the use of the technology for weapons and surveillance applications.

// // OpenAI shared a demo of an automated sales agent system during an event in Tokyo, which has the ability to handle tasks like enterprise lead qualification and meeting scheduling.

// // Amazon scheduled a hardware event for Feb. 26 in New York, where it is expected to unveil its long-awaited AI-enhanced Alexa overhaul.

// // Enterprise software giant Workday announced plans to cut 1,750 jobs or 8.5% of its workforce as part of an AI-driven restructuring plan.

// // MIT researchers unveiled SySTeC, a tool that speeds up AI computations by automatically eliminating redundant calculations, achieving up to 30x speed increases.

// // *Sponsored Listing

// // COMMUNITY

// // 🎥 Join our next live workshop

// // Join our next workshop this Friday at 4 PM EST to learn how to leverage OpenAI’s Deep Research tool, access open source alternatives, and create your own for free with Dr. Alvaro Cintas, The Rundown’s AI professor.

// // RSVP here. Not a member? Join The Rundown University on a 14-day free trial.

// // This is off topic at last also tell which gemini model is used for this api call.

// // `);


// //     console.log(result.response.text());
// //   }
  
// //   run();

