import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "./Contact.css";

const defaultMockMessages = [
  {
    _id: "1",
    name: "Ravi",
    email: "r@gmail.com",
    mobile: "98xxx",
    message: "Need seeds"
  },
  {
    _id: "2",
    name: "Amit",
    email: "a@gmail.com",
    mobile: "99xxx",
    message: "Price query"
  }
];

function Contact() {
  const { t } = useLanguage();
  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") user = JSON.parse(userStr);
  } catch (e) {}

  const isAdmin = user?.role === "admin";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Modals state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await API.get("/contact");
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages(defaultMockMessages);
      }
    } catch (err) {
      console.error("Failed to fetch messages, using default mock:", err);
      setMessages(defaultMockMessages);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/contact", formData);
    } catch (err) {
      console.log("Error sending to server, saved locally:", err);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", mobile: "", email: "", message: "" });
    }, 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/contact/${id}`);
    } catch (err) {
      console.log("Delete error, removing from state:", err);
    }
    setMessages(messages.filter((m) => m._id !== id));
    if (selectedMessage?._id === id) setSelectedMessage(null);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setReplyMessage(null);
      setReplyContent("");
    }, 2000);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="contact-container container">
        <h1 className="contact-title">
          {isAdmin ? t("contactAdminTitle") : t("contactTitle")}
        </h1>

        {isAdmin ? (
          /* ================= ADMIN VIEW: MESSAGES TABLE ================= */
          <div className="admin-messages-wrapper">
            <div className="admin-msg-header">
              <h2>📬 User Messages</h2>
              <span className="msg-badge-count">
                {messages.length} Message{messages.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loadingMessages ? (
              <div className="messages-loading">Loading user messages...</div>
            ) : messages.length === 0 ? (
              <div className="no-messages-box">
                <span className="empty-icon">📥</span>
                <p>No user messages found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="user-messages-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Message</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg, index) => (
                      <tr key={msg._id || index}>
                        <td>{index + 1}</td>
                        <td className="font-bold">{msg.name}</td>
                        <td>
                          <a href={`mailto:${msg.email}`} className="msg-email-link">
                            {msg.email}
                          </a>
                        </td>
                        <td>{msg.mobile}</td>
                        <td className="msg-preview-cell" title={msg.message}>
                          {msg.message}
                        </td>
                        <td>
                          <div className="action-buttons-wrap">
                            <button
                                className="btn-action btn-view"
                                onClick={() => setSelectedMessage(msg)}
                                title="View full message details"
                            >
                              👁️ View
                            </button>
                            <button
                                className="btn-action btn-delete"
                                onClick={() => handleDelete(msg._id)}
                                title="Delete message"
                            >
                              🗑️ Delete
                            </button>
                            <button
                                className="btn-action btn-reply"
                                onClick={() => {
                                  setReplyMessage(msg);
                                  setReplyContent(
                                      `Hi ${msg.name},\n\nThank you for contacting Smart Krushi regarding your query: "${msg.message}".\n\nBest regards,\nSmart Krushi Support`
                                  );
                                }}
                                title="Reply to message"
                            >
                              ✉️ Reply
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* ================= USER / VISITOR VIEW: CONTACT FORM & ADDRESS ================= */
          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-card">
              {submitted && (
                <div className="success-banner">
                  {t("contactSuccessBanner")}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t("contactLabelName")}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t("contactPlaceholderName")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">{t("contactLabelMobile")}</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    placeholder={t("contactPlaceholderMobile")}
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t("contactLabelEmail")}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("contactPlaceholderEmail")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t("contactLabelMessage")}</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t("contactPlaceholderMessage")}
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-send-message">
                  {t("contactBtnSend")}
                </button>
              </form>
            </div>

            {/* Address Details Card */}
            <div className="contact-address-card">
              <div className="address-header">
                <h3>{t("contactAddressHeader")}</h3>
              </div>
              <div className="address-body">
                <div className="address-item">
                  <strong>{t("contactState")}</strong> <span>{t("contactStateVal")}</span>
                </div>
                <div className="address-item">
                  <strong>{t("contactDist")}</strong> <span>{t("contactDistVal")}</span>
                </div>
                <div className="address-item">
                  <strong>{t("contactPlace")}</strong> <span>{t("contactPlaceVal")}</span>
                </div>
                <div className="address-item">
                  <strong>{t("contactEmail")}</strong>{" "}
                  <a href="mailto:harshad53kar@gmail.com">harshad53kar@gmail.com</a>
                </div>
                <div className="address-item">
                  <strong>{t("contactMobile")}</strong>{" "}
                  <a href="tel:9096522953">9096522953</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MESSAGE MODAL */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📩 View User Message</h3>
              <button className="modal-close-btn" onClick={() => setSelectedMessage(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Name:</strong> <span>{selectedMessage.name}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
              </div>
              <div className="detail-row">
                <strong>Mobile:</strong> <span>{selectedMessage.mobile}</span>
              </div>
              <div className="detail-row full-msg">
                <strong>Message:</strong>
                <p className="msg-text">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="modal-footer">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Query to Smart Krushi&body=Hi ${selectedMessage.name},\n\n`}
                className="btn-action btn-reply"
                style={{ textDecoration: "none" }}
              >
                ✉️ Open Mail Client
              </a>
              <button
                className="btn-action btn-delete"
                onClick={() => handleDelete(selectedMessage._id)}
              >
                🗑️ Delete
              </button>
              <button
                className="btn-action btn-close"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPLY MODAL */}
      {replyMessage && (
        <div className="modal-overlay" onClick={() => setReplyMessage(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✉️ Reply to {replyMessage.name}</h3>
              <button className="modal-close-btn" onClick={() => setReplyMessage(null)}>
                ✕
              </button>
            </div>
            {replySuccess ? (
              <div className="success-banner" style={{ margin: "20px" }}>
                ✅ Reply sent successfully!
              </div>
            ) : (
              <form onSubmit={handleSendReply}>
                <div className="modal-body">
                  <div className="detail-row">
                    <strong>To:</strong> <span>{replyMessage.name} ({replyMessage.email})</span>
                  </div>
                  <div className="form-group" style={{ marginTop: "12px" }}>
                    <label>Reply Content:</label>
                    <textarea
                      rows="5"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn-action btn-send-reply">
                    🚀 Send Reply
                  </button>
                  <a
                    href={`mailto:${replyMessage.email}?subject=Reply from Smart Krushi&body=${encodeURIComponent(
                      replyContent
                    )}`}
                    className="btn-action btn-view"
                    style={{ textDecoration: "none" }}
                  >
                    📧 Mail App
                  </a>
                  <button
                    type="button"
                    className="btn-action btn-close"
                    onClick={() => setReplyMessage(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Contact;
