import type { FC } from "react";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/ui/button";
import {
  Image,
  Search,
  Share2,
  Key,
  SplitSquareHorizontal,
  Sparkles,
  FileUp,
} from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const FeatureItem = ({
  icon: Icon,
  children,
}: {
  icon: typeof Image;
  children: string;
}) => (
  <motion.li
    variants={fadeIn}
    className="group relative flex items-center gap-4 bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] p-4 rounded-xl h-[76px] transition-all duration-300"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-[var(--primary-color)] opacity-20 group-hover:opacity-30 blur-lg transition-opacity" />
      <div className="relative bg-gradient-to-br from-[rgb(66,255,252,0.75)] to-[var(--primary-color)] p-2.5 rounded-lg text-white">
        <Icon size={20} className="flex-shrink-0" />
      </div>
    </div>
    <span className="font-medium text-[var(--text-primary-color)]">
      {children}
    </span>
  </motion.li>
);

const FeatureColumn = ({
  title,
  features,
}: {
  title: string;
  features: { id: string; icon: typeof Image; text: string }[];
}) => (
  <motion.div initial="hidden" animate="visible" className="space-y-3">
    <h3 className="flex items-center mb-4 h-[24px] font-semibold text-[var(--text-primary-color)]">
      {title}
    </h3>
    <div className="space-y-3">
      {features.map((feature, index) => (
        <motion.div
          key={feature.id}
          variants={fadeIn}
          transition={{ delay: index * 0.1 }}
        >
          <FeatureItem icon={feature.icon}>{feature.text}</FeatureItem>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const WelcomeModal: FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const chatFeatures = [
    {
      id: "multi-model",
      icon: SplitSquareHorizontal,
      text: "Chat with multiple models",
    },
    { id: "image-gen", icon: Image, text: "Generate images instantly" },
    { id: "web-search", icon: Search, text: "Search the web for answers" },
  ];

  const productivityFeatures = [
    { id: "file-upload", icon: FileUp, text: "Attach and analyze files" },
    { id: "share", icon: Share2, text: "Share chats with links" },
    { id: "api-key", icon: Key, text: "Use custom API keys" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-8 px-2">
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-3 text-center"
        >
          <motion.div variants={fadeIn} className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--primary-color)] opacity-20 blur-xl" />
              <div className="relative bg-gradient-to-br from-[rgb(66,255,252,0.75)] to-[var(--primary-color)] p-4 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <h2 className="bg-clip-text bg-gradient-to-r from-[rgb(66,255,252,0.75)] to-[var(--primary-color)] font-bold text-transparent text-3xl">
              Welcome to T4 Chat
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[var(--text-secondary-color)] text-sm leading-relaxed">
              Experience the future of AI conversations with our powerful and
              intuitive chat platform
            </p>
          </motion.div>
        </motion.div>

        <div className="gap-6 grid grid-cols-2">
          <FeatureColumn title="Chat Features" features={chatFeatures} />
          <FeatureColumn
            title="Productivity Tools"
            features={productivityFeatures}
          />
        </div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex justify-end pt-2"
        >
          <Button
            onClick={onClose}
            className="bg-gradient-to-br from-[rgb(66,255,252,0.75)] to-[var(--primary-color)] px-6 py-2 font-medium text-sm"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
