// import { motion } from 'motion/react';
// import { Plane, Calendar } from 'lucide-react';
// import { Card } from '../../ui/card';
// import { Badge } from '../../ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

// const events = [
//   {
//     id: 1,
//     name: 'Debate Club Meeting',
//     date: 'Tuesday, 6:00 PM',
//     location: 'Room 302',
//     status: 'confirmed',
//     attending: 18,
//     total: 20,
//   },
//   {
//     id: 2,
//     name: 'Public Speaking Workshop',
//     date: 'Friday, 5:00 PM',
//     location: 'Room 205',
//     status: 'interested',
//     attending: 8,
//     total: 20,
//   },
//   {
//     id: 3,
//     name: 'Tournament Prep',
//     date: 'Saturday, 10:00 AM',
//     location: 'Main Hall',
//     status: 'available',
//     attending: 15,
//     total: 20,
//   },
// ];

// export function MemberEventsMobile() {
//   return (
//     <div className="h-full overflow-y-auto">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
//             <Plane className="w-5 h-5 text-white transform rotate-45" />
//           </div>
//           <h1 className="text-xl text-[#e2e8f0]">Events</h1>
//         </div>
//       </motion.div>

//       <Tabs defaultValue="calendar" className="h-full">
//         <div className="sticky top-[72px] z-10 bg-[#0f172a] px-4 pt-2 pb-3">
//           <TabsList className="w-full bg-[#1e293b]">
//             <TabsTrigger value="calendar" className="flex-1">
//               📅 Calendar
//             </TabsTrigger>
//             <TabsTrigger value="club-events" className="flex-1">
//               🎯 Club Events
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         <TabsContent value="calendar" className="p-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
//               <h3 className="text-[#e2e8f0] mb-3">January 2025</h3>
//               <div className="grid grid-cols-7 gap-2">
//                 {/* Calendar Grid */}
//                 {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                   <button
//                     key={day}
//                     className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
//                       day === 23
//                         ? 'bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] text-white'
//                         : day === 24
//                         ? 'bg-[#0f172a] text-[#64748b]'
//                         : day === 25
//                         ? 'bg-[#eab308]/20 text-[#eab308]'
//                         : 'text-[#94a3b8] hover:bg-[#0f172a]'
//                     }`}
//                   >
//                     {day}
//                   </button>
//                 ))}
//               </div>
//             </Card>

//             <Card className="bg-[#1e293b] border-[#334155] p-4">
//               <h3 className="text-[#e2e8f0] mb-3">Today's Events</h3>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between p-2 bg-[#0f172a] rounded-lg">
//                   <div>
//                     <p className="text-[#e2e8f0] text-sm">Debate Club</p>
//                     <p className="text-xs text-[#64748b]">6:00 PM</p>
//                   </div>
//                   <Badge variant="secondary" className="bg-[#429ebd]/20 text-[#429ebd]">
//                     Club Event
//                   </Badge>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>
//         </TabsContent>

//         <TabsContent value="club-events" className="p-4 space-y-3">
//           {events.map((event, index) => (
//             <motion.div
//               key={event.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ 
//                 duration: 0.3, 
//                 delay: index * 0.08,
//               }}
//             >
//               <Card className="bg-[#1e293b] border-[#334155] p-4">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <h3 className="text-[#e2e8f0] mb-1">{event.name}</h3>
//                     <div className="flex items-center gap-2 text-sm text-[#94a3b8] mb-1">
//                       <Calendar className="w-3 h-3" />
//                       <span>{event.date}</span>
//                     </div>
//                     <p className="text-xs text-[#64748b]">{event.location}</p>
//                   </div>
//                   <Badge
//                     variant="secondary"
//                     className={
//                       event.status === 'confirmed'
//                         ? 'bg-[#10b981]/20 text-[#10b981]'
//                         : event.status === 'interested'
//                         ? 'bg-[#eab308]/20 text-[#eab308]'
//                         : 'bg-[#94a3b8]/20 text-[#94a3b8]'
//                     }
//                   >
//                     {event.status === 'confirmed' && '✅ Confirmed'}
//                     {event.status === 'interested' && 'Interested'}
//                     {event.status === 'available' && '✅ Available'}
//                   </Badge>
//                 </div>
//                 <p className="text-xs text-[#64748b] mb-3">
//                   {event.attending}/{event.total} attending
//                 </p>
//               </Card>
//             </motion.div>
//           ))}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import { motion } from 'motion/react';
import { Plane, Calendar } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

const events = [
  {
    id: 1,
    name: 'Debate Club Meeting',
    date: 'Tuesday, 6:00 PM',
    location: 'Room 302',
    status: 'confirmed',
    attending: 18,
    total: 20,
  },
  {
    id: 2,
    name: 'Public Speaking Workshop',
    date: 'Friday, 5:00 PM',
    location: 'Room 205',
    status: 'interested',
    attending: 8,
    total: 20,
  },
  {
    id: 3,
    name: 'Tournament Prep',
    date: 'Saturday, 10:00 AM',
    location: 'Main Hall',
    status: 'available',
    attending: 15,
    total: 20,
  },
];

export function MemberEventsMobile() {
  return (
    <div className="p-4 bg-[#0f172a] text-white min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 bg-[#0f172a] border-b border-[#1e293b] px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white transform rotate-45" />
          </div>
          <h1 className="text-xl text-white font-semibold">Events</h1>
        </div>
      </motion.div>

      <Tabs defaultValue="calendar" className="h-full">
        <div className="sticky top-[72px] z-10 bg-[#0f172a] px-4 pt-2 pb-3">
          <TabsList className="w-full bg-[#1e293b]">
            <TabsTrigger value="calendar" className="flex-1 text-white data-[state=active]:text-white">
              📅 Calendar
            </TabsTrigger>
            <TabsTrigger value="club-events" className="flex-1 text-white data-[state=active]:text-white">
              🎯 Club Events
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calendar" className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
              <h3 className="text-white font-semibold mb-3">January 2025</h3>
              <div className="grid grid-cols-7 gap-2">
                {/* Calendar Grid */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                      day === 23
                        ? 'bg-gradient-to-br from-[#429ebd] to-[#9fe7f5] text-white'
                        : day === 24
                        ? 'bg-[#0f172a] text-[#64748b]'
                        : day === 25
                        ? 'bg-[#eab308]/20 text-[#eab308]'
                        : 'text-[#94a3b8] hover:bg-[#0f172a]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <h3 className="text-white font-semibold mb-3">Today's Events</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#0f172a] rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">Debate Club</p>
                    <p className="text-xs text-[#64748b]">6:00 PM</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#429ebd]/20 text-[#429ebd] border-0">
                    Club Event
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="club-events" className="p-4 space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.08,
              }}
            >
              <Card className="bg-[#1e293b] border-[#334155] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{event.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#94a3b8] mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                    </div>
                    <p className="text-xs text-[#64748b]">{event.location}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      event.status === 'confirmed'
                        ? 'bg-[#10b981]/20 text-[#10b981] border-0'
                        : event.status === 'interested'
                        ? 'bg-[#eab308]/20 text-[#eab308] border-0'
                        : 'bg-[#94a3b8]/20 text-[#94a3b8] border-0'
                    }
                  >
                    {event.status === 'confirmed' && '✅ Confirmed'}
                    {event.status === 'interested' && 'Interested'}
                    {event.status === 'available' && '✅ Available'}
                  </Badge>
                </div>
                <p className="text-xs text-[#64748b] mb-3">
                  {event.attending}/{event.total} attending
                </p>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}