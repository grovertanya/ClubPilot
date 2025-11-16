import { useState } from "react";
import { ArrowLeft, Check, X, Send } from "lucide-react";

interface MemberMessagesMobileProps {
  event: any;
  invitedMembers: string[];
  eventId?: string;
  onBack: () => void;
  onConfirm: () => void;
}

export function MemberMessagesMobile({
  event,
  invitedMembers,
  onBack,
  onConfirm
}: MemberMessagesMobileProps) {

  const members = invitedMembers.map((id, i) => ({
    id,
    name: `Member ${i + 1}`
  }));

  const [messages, setMessages] = useState(
    members.map(m => ({
      member: m,
      text: `Hey ${m.name}, just checking if you're all set for "${event.name}" happening at ${event.time}. Let me know!`,
      approved: false,
      rejected: false,
      sent: false
    }))
  );

  // -----------------------------
  // SEND MESSAGE -> FASTAPI
  // -----------------------------
  const sendMessage = async (memberId: string, text: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: event.id,
          member_id: memberId,
          message: text
        })
      });

      const data = await res.json();
      console.log("Message send result:", data);

      if (data?.success) {
        // update UI to show "Sent"
        setMessages(prev =>
          prev.map(m =>
            m.member.id === memberId ? { ...m, sent: true } : m
          )
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // -----------------------------
  // APPROVE / REJECT
  // -----------------------------
  const approve = (id: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.member.id === id ? { ...m, approved: true, rejected: false } : m
      )
    );
  };

  const reject = (id: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.member.id === id ? { ...m, rejected: true, approved: false } : m
      )
    );
  };

  return (
    <div className="message-wrapper">

      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>
        <h2>Member Messaging</h2>
      </div>

      {/* MESSAGE ROWS */}
      <div className="message-list">
        {messages.map((m, index) => (
          <div key={index} className="message-bubble">

            <div className="message-header">
              <span className="member-name">{m.member.name}</span>

              <div className="badge">
                {m.sent
                  ? "Sent ✔"
                  : m.approved
                  ? "Ready ✔"
                  : m.rejected
                  ? "Edited ✖"
                  : "Pending"}
              </div>
            </div>

            <p className="message-text">{m.text}</p>

            <div className="actions">
              <button
                className="approve-btn"
                onClick={() => approve(m.member.id)}
              >
                <Check size={18} />
              </button>

              <button
                className="reject-btn"
                onClick={() => reject(m.member.id)}
              >
                <X size={18} />
              </button>

              <button
                className="send-btn"
                onClick={() => sendMessage(m.member.id, m.text)}
                disabled={m.sent}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="finish-btn" onClick={onConfirm}>
        Done Messaging
      </button>
    </div>
  );
}
