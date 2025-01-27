import { TabCard } from "@/components/Tabcard";
import { motion } from "framer-motion";

const AddFriends = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <TabCard heading="Add Friends">
                <div className="px-4 py-6 sm:px-6 sm:py-8 min-h-full">
                <div className="max-w-3xl mb-5">
                    <p className="mt-1 text-sm font-normal text-gray-500">
                    Find and add friends to your network.
                    </p>
                </div>
                </div>
            </TabCard>
        </motion.div>
    )
}

export default AddFriends;