import { Plane } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { UserRole } from '../../App';

interface LoginScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export function LoginScreen({ onSelectRole }: LoginScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.215, 0.61, 0.355, 1],
          delay: 0.2 
        }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#429ebd]/30">
          <Plane className="w-12 h-12 text-white transform rotate-45" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="text-3xl text-[#e2e8f0] text-center mb-3"
      >
        Welcome to ClubPilot
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-[#94a3b8] text-center mb-12"
      >
        Coordination made effortless. Choose your role to get started.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="w-full space-y-4"
      >
        <Button
          onClick={() => onSelectRole('captain')}
          className="w-full h-14 bg-gradient-to-r from-[#429ebd] to-[#9fe7f5] text-white text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#429ebd]/20"
        >
          Login as Captain
        </Button>

        <Button
          onClick={() => onSelectRole('member')}
          className="w-full h-14 bg-[#2d3748] text-[#94a3b8] text-lg hover:bg-[#374151] transition-colors"
        >
          Login as Club Member
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="text-[#64748b] text-sm text-center mt-auto"
      >
        Your clubs, managed smarter with ClubPilot.
      </motion.p>
    </div>
  );
}
