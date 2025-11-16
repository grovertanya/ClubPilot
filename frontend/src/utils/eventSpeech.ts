export function generateEventSpeech(data: {
    free: string[];
    busy: string[];
    notified?: boolean;
  }) {
    const freeList = data.free.join(", ");
    const busyList = data.busy.join(", ");
  
    let msg = "Event created! ";
  
    if (data.free.length > 0) {
      msg += `${freeList} ${data.free.length === 1 ? "is" : "are"} free. `;
    }
  
    if (data.busy.length > 0) {
      msg += `${busyList} ${data.busy.length === 1 ? "has" : "have"} a conflict. `;
    }
  
    if (data.notified) msg += "Messages sent to all members.";
  
    return msg;
  }
  