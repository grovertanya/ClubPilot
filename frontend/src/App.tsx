import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginScreen } from './components/mobile/LoginScreen';
import { MobileApp } from './components/mobile/MobileApp';

export type UserRole = 'captain' | 'member' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-full max-w-[390px] h-[844px] bg-[#0f172a] overflow-hidden relative shadow-2xl">
        <AnimatePresence mode="wait">
          {!userRole ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <LoginScreen onSelectRole={setUserRole} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <MobileApp userRole={userRole} onLogout={() => setUserRole(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
