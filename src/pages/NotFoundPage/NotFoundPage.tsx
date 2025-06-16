import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

interface NotFoundPageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const NotFoundPage = ({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist.",
  showBackButton = true,
}: NotFoundPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center bg-[var(--component-bg-color)] min-h-screen text-[var(--text-primary-color)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[rgba(var(--primary-color-rgb),0.1)] p-4 rounded-full">
            <AlertCircle size={48} className="text-[var(--primary-color)]" />
          </div>
        </div>
        <motion.h1
          className="mb-4 font-bold text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mb-8 text-[var(--text-secondary-color)] text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.p>
        {showBackButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center"
          >
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="flex justify-center items-center gap-2 min-w-40 h-11 text-base"
            >
              <Home size={18} />
              Go Home
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
