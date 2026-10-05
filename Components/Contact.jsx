import React, { useState } from "react";
import toast from "react-hot-toast";
import Reveal from "./Reveal";

const Contact = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!formValues.name.trim()) {
      toast.error("Add your name.");
      return;
    }
    if (!formValues.email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    if (formValues.message.trim().length < 8) {
      toast.error("Write a short message.");
      return;
    }

    setSending(true);
    const key = "ico-contact-messages";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift({ ...formValues, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
    setFormValues({ name: "", email: "", message: "" });
    setSending(false);
    toast.success("Message saved. We'll get back to you.");
  };

  return (
    <section id="contact" className="ico-contact pos-rel">
      <div className="container">
        <Reveal>
          <div className="ico-contact__wrap contact-card">
            <h2 className="title">Talk to the team</h2>
            <p className="contact-lead">
              Questions about the round, KYC, or the contract. Send a note and it stays on this device.
            </p>
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formValues.name}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="col-lg-12">
                  <textarea
                    name="message"
                    placeholder="What do you want to know?"
                    value={formValues.message}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <div className="ico-contact__btn text-center mt-10">
                  <button className="thm-btn" type="submit" disabled={sending}>
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
