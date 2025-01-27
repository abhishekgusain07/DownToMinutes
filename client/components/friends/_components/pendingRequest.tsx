import { TabCard } from "@/components/Tabcard";
import { motion } from "framer-motion";

const PendingRequests = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div>
                <TabCard heading="Pending Requests">
                    <div className="px-4 py-6 sm:px-6 sm:py-8 min-h-full">
                    <div className="max-w-3xl mb-5">
                        <p className="mt-1 text-sm font-normal text-gray-500">
                        View and manage your pending friend requests.
                        </p>
                    </div>
                    </div>
                </TabCard>
            </div>
        </motion.div>
    )
}

export default PendingRequests;