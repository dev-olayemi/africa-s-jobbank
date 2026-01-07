import { useState } from "react";
import Layout from "@/components/Layout";
import { NoMessages } from "@/components/EmptyStates";
import VerificationBadge from "@/components/VerificationBadge";
import { Search, Send, ArrowLeft, MoreVertical } from "lucide-react";

const mockConversations = [
  {
    id: "1",
    name: "TechMart Nigeria",
    avatar: "https://ui-avatars.com/api/?name=TM&background=0D9488&color=fff",
    lastMessage: "Thank you for your application. We would like to...",
    time: "2h ago",
    unread: 2,
    verified: true,
  },
  {
    id: "2",
    name: "HR Solutions Ltd",
    avatar: "https://ui-avatars.com/api/?name=HR&background=F97316&color=fff",
    lastMessage: "Hi! We have a position that might interest you.",
    time: "1d ago",
    unread: 0,
    verified: true,
  },
  {
    id: "3",
    name: "Emeka Johnson",
    avatar: "https://ui-avatars.com/api/?name=EJ&background=EAB308&color=fff",
    lastMessage: "Good luck with the interview!",
    time: "3d ago",
    unread: 0,
    verified: false,
  },
];

const mockMessages = [
  { id: "1", sender: "them", text: "Hello! Thank you for applying to our Sales Representative position.", time: "10:30 AM" },
  { id: "2", sender: "me", text: "Thank you for considering my application. I'm very interested in this opportunity.", time: "10:35 AM" },
  { id: "3", sender: "them", text: "We reviewed your profile and would like to schedule an interview. Are you available this week?", time: "10:40 AM" },
  { id: "4", sender: "me", text: "Yes, I'm available. What day and time works best for you?", time: "10:45 AM" },
  { id: "5", sender: "them", text: "How about Wednesday at 2 PM? We can do a video call.", time: "11:00 AM" },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selected = mockConversations.find((c) => c.id === selectedConversation);

  const filteredConversations = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // Would send message here
    setNewMessage("");
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex">
        {/* Conversation List */}
        <div className={`w-full md:w-80 border-r border-base-200 flex flex-col ${selectedConversation ? "hidden md:flex" : ""}`}>
          <div className="p-4 border-b border-base-200">
            <h1 className="text-xl font-bold mb-3">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered input-sm w-full pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-base-200 transition-colors text-left ${
                    selectedConversation === conv.id ? "bg-base-200" : ""
                  }`}
                >
                  <div className="relative">
                    <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                    {conv.unread > 0 && (
                      <span className="absolute -top-1 -right-1 badge badge-primary badge-xs">{conv.unread}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{conv.name}</span>
                      {conv.verified && <VerificationBadge size="sm" />}
                    </div>
                    <p className="text-sm text-base-content/60 line-clamp-1">{conv.lastMessage}</p>
                  </div>
                  <span className="text-xs text-base-content/40">{conv.time}</span>
                </button>
              ))
            ) : (
              <div className="p-4">
                <NoMessages />
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedConversation ? "hidden md:flex" : ""}`}>
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-base-200">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="btn btn-ghost btn-sm btn-circle md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img src={selected.avatar} alt={selected.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{selected.name}</span>
                    {selected.verified && <VerificationBadge size="sm" />}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm btn-circle">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl ${
                        msg.sender === "me"
                          ? "bg-primary text-primary-content rounded-br-md"
                          : "bg-base-200 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-primary-content/70" : "text-base-content/50"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-base-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="input input-bordered flex-1"
                  />
                  <button onClick={handleSend} className="btn btn-primary btn-circle">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-base-content/50">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
