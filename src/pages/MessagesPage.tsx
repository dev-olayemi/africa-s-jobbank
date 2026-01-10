import { useState } from "react";
import { MessageCircle, Search, Send } from "lucide-react";
import Layout from "@/components/Layout";

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
          <div className="grid grid-cols-12 h-full">
            {/* Chat List */}
            <div className="col-span-12 md:col-span-4 border-r border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="overflow-y-auto" style={{ height: "calc(100% - 120px)" }}>
                <div className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start connecting with people to begin messaging</p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-12 md:col-span-8 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold">
                        {selectedChat.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedChat.name}</h3>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">No messages yet</p>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button className="btn btn-primary gap-2">
                        <Send className="h-4 w-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-20 w-20 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
