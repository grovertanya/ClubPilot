const API_URL = "http://127.0.0.1:8000/api";

export const fetchEventMessages = async (eventId: string) => {
  const res = await axios.get(`${API_URL}/messages/${eventId}`);
  return res.data.messages;
};

export const sendMemberMessage = async (
  eventId: string,
  memberId: string,
  message: string
) => {
  const res = await axios.post(`${API_URL}/messages/send`, {
    event_id: eventId,
    member_id: memberId,
    message
  });
  return res.data;
};
