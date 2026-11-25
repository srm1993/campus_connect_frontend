import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../socket/socket";
import "./StudentClubChat.css";

const API = "http://localhost:8000";

function StudentClubChat() {

    const userId = localStorage.getItem("userid");

    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [loadingClubs, setLoadingClubs] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);

    // Get student joined clubs
    useEffect(() => {

        const fetchMyClubs = async () => {

            try {

                const response = await axios.get(
                    `${API}/club/allClubs`
                );

                const allClubs =
                    response.data.clubs || response.data;

                // Filter clubs joined by logged-in student
                const myClubs = allClubs.filter((club) =>
                    club.members?.some((member) => {

                        const memberId =
                            member?._id || member;

                        return String(memberId) === String(userId);

                    })
                );

                setClubs(myClubs);

                // Select first club automatically
                if (myClubs.length > 0) {
                    setSelectedClub(myClubs[0]);
                }

            } catch (err) {

                console.log("Club fetch error:", err);

                setError("Unable to load your clubs.");

            } finally {

                setLoadingClubs(false);

            }

        };

        if (userId) {
            fetchMyClubs();
        } else {
            setError("Please login to access club chat.");
            setLoadingClubs(false);
        }

    }, [userId]);


    // Fetch messages and connect socket
    useEffect(() => {

        if (!selectedClub || !userId) return;

        let active = true;

        const clubId = selectedClub._id;

        setMessages([]);
        setLoadingMessages(true);

        // Fetch previous messages
        const fetchMessages = async () => {

            try {

                const response = await axios.get(
                    `${API}/club/clubs/${clubId}/messages`,
                    {
                        params: { userId }
                    }
                );

                if (active) {
                    setMessages(response.data.messages || []);
                }

            } catch (err) {

                console.log("Message fetch error:", err);

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load messages."
                    );
                }

            } finally {

                if (active) {
                    setLoadingMessages(false);
                }

            }

        };


        // Join selected club room
        const joinRoom = () => {

            socket.emit("joinClub", {
                clubId,
                userId
            });

        };


        // Receive new messages
        const receiveMessage = (newMessage) => {

            if (!active) return;

            setMessages((prev) => {

                const exists = prev.some(
                    (item) => item._id === newMessage._id
                );

                if (exists) return prev;

                return [...prev, newMessage];

            });

        };


        socket.on("newMessage", receiveMessage);
        socket.on("connect", joinRoom);

        const handleChatError = (err) => {
            console.error("Chat error:", err);
        };

        socket.on("chatError", handleChatError);

        if (!socket.connected) {
            socket.connect();
        } else {
            joinRoom();
        }

        fetchMessages();

        return () => {

            active = false;

            socket.off("newMessage", receiveMessage);
            socket.off("connect", joinRoom);
            socket.off("chatError", handleChatError);

            if (socket.connected) {
                socket.emit("leaveClub", clubId);
            }

        };

    }, [selectedClub?._id, userId]);


    // Automatically scroll to latest message
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    // Send message
    const handleSendMessage = async (e) => {

        e.preventDefault();

        if (!message.trim() || !selectedClub || sending) {
            return;
        }

        const messageText = message.trim();

        setSending(true);

        try {

            await axios.post(
                `${API}/club/clubs/${selectedClub._id}/messages`,
                {
                    userId,
                    message: messageText
                }
            );

            setMessage("");

        } catch (err) {

            console.log("Send message error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to send message."
            );

        } finally {

            setSending(false);

        }

    };


    // Format message time
    const formatTime = (date) => {

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    };


    return (

        <div className="whatsapp-chat-page">

            <div className="whatsapp-chat-wrapper">

                {/* LEFT SIDEBAR */}

                <div className="chat-sidebar">

                    <div className="sidebar-header">

                        <div>
                            <h2>Club Chats</h2>
                            <p>Campus Connect Community</p>
                        </div>

                        <span className="club-count">
                            {clubs.length}
                        </span>

                    </div>


                    <div className="sidebar-search">

                        <input
                            type="text"
                            placeholder="Your joined clubs"
                            disabled
                        />

                    </div>


                    <div className="club-list">

                        {loadingClubs ? (

                            <div className="chat-loading">
                                Loading clubs...
                            </div>

                        ) : error && clubs.length === 0 ? (

                            <div className="chat-empty">
                                {error}
                            </div>

                        ) : clubs.length === 0 ? (

                            <div className="chat-empty">
                                <h3>No Clubs Joined</h3>
                                <p>
                                    Join a club to start chatting.
                                </p>
                            </div>

                        ) : (

                            clubs.map((club) => (

                                <div
                                    key={club._id}
                                    className={`club-list-item ${
                                        selectedClub?._id === club._id
                                            ? "active-club"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setError("");
                                        setSelectedClub(club);
                                    }}
                                >

                                    <div className="club-avatar">
                                        {club.clubName?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="club-info">

                                        <h4>{club.clubName}</h4>

                                        <p>
                                            {club.description ||
                                                "Club community chat"}
                                        </p>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* RIGHT CHAT SECTION */}

                <div className="chat-main">

                    {selectedClub ? (

                        <>

                            {/* CHAT HEADER */}

                            <div className="conversation-header">

                                <div className="club-avatar">
                                    {selectedClub.clubName
                                        ?.charAt(0).toUpperCase()}
                                </div>

                                <div className="conversation-info">

                                    <h3>{selectedClub.clubName}</h3>

                                    <p>
                                        {selectedClub.members?.length || 0}
                                        {" "}Club Members
                                    </p>

                                </div>

                            </div>


                            {/* CHAT MESSAGES */}

                            <div className="conversation-body">

                                {loadingMessages ? (

                                    <div className="chat-empty">
                                        Loading messages...
                                    </div>

                                ) : messages.length === 0 ? (

                                    <div className="welcome-chat">

                                        <div className="welcome-icon">
                                            💬
                                        </div>

                                        <h2>
                                            Welcome to {selectedClub.clubName}
                                        </h2>

                                        <p>
                                            Start a conversation with your
                                            club members.
                                        </p>

                                    </div>

                                ) : (

                                    messages.map((msg) => {

                                        const senderId =
                                            msg.senderId?._id ||
                                            msg.senderId;

                                        const isMine =
                                            String(senderId) ===
                                            String(userId);

                                        return (

                                            <div
                                                key={msg._id}
                                                className={`message-row ${
                                                    isMine
                                                        ? "sent"
                                                        : "received"
                                                }`}
                                            >

                                                <div className="message-content">

                                                    {!isMine && (

                                                        <h5>
                                                            {msg.senderId?.name ||
                                                                "Student"}
                                                        </h5>

                                                    )}

                                                    <p>{msg.message}</p>

                                                    <span>
                                                        {formatTime(
                                                            msg.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        );

                                    })

                                )}

                                <div ref={messagesEndRef} />

                            </div>


                            {/* MESSAGE INPUT */}

                            <form
                                className="message-input-area"
                                onSubmit={handleSendMessage}
                            >

                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    maxLength={2000}
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        !message.trim() || sending
                                    }
                                >
                                    {sending ? "Sending..." : "➤"}
                                </button>

                            </form>

                        </>

                    ) : (

                        <div className="select-club-screen">

                            <div className="welcome-icon">
                                💬
                            </div>

                            <h2>Campus Connect Club Chat</h2>

                            <p>
                                Select a club from the left side
                                to start a conversation.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default StudentClubChat;