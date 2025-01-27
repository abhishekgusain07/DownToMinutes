import { TabCard } from "@/components/Tabcard";
import { motion } from "framer-motion";

const Manage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <TabCard heading="Manage Accountability Partners">
                <div className="px-4 py-6 sm:px-6 sm:py-8 min-h-full">
                <div className="max-w-3xl mb-5">
                    <p className=" text-sm font-normal text-gray-500">
                        Decide Who you want to send notifications to about your progress .
                    </p>
                </div>
                </div>
            </TabCard>
        </motion.div>
    )
}

export default Manage;