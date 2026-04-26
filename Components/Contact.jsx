import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "@formspree/react";

const Contact = () => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [state, handleSubmit] = useForm("xpwanoep");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state.succeeded) {
      notifySuccess("Message sent successfully!");
      setSubmitted(true);
      setFormValues({ name: "", email: "", message: "" });

      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!formValues.email || !formValues.email.includes("@")) {
      notifyError("Please enter a valid email address.");
      return;
    }

    // Show immediate feedback even if external submission isn't completed.
    notifySuccess("Message sent! We'll get back to you soon.");
    setSubmitted(true);
    setFormValues({ name: "", email: "", message: "" });

    // Let Formspree handle the actual submission too.
    handleSubmit(e);
  };

  return (
    <section id="contact" className="ico-contact pos-rel">
      <div className="container">
        <div className="ico-contact__wrap">
          <h2 className="title">Contact Us </h2>
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="col-lg-6">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div className="col-lg-12">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  value={formValues.message}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, message: e.target.value }))
                  }
                ></textarea>
              </div>

              <div className="ico-contact__btn text-center mt-10">
                <button
                  className="thm-btn"
                  type="submit"
                  disabled={state.submitting}
                >
                  Send Message
                </button>
              </div>

              {submitted && (
                <div className="contact-success-message">
                  Thanks for writing! We’ll get back to you soon.
                </div>
              )}
            </div>
          </form>

          <div className="ico-contact__shape-img">
            <div className="shape shape--1">
              <div data-parallax='{"y" : -50}'>
                <img src="assets/img/shape/c_shape1.png" alt="" />
              </div>
            </div>
            <div className="shape shape--2">
              <div data-parallax='{"y" : 60}'>
                <img src="assets/img/shape/c_shape2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ico-contact__shape">
        <div className="shape shape--1">
          <img src="assets/img/shape/f_shape1.png" alt="" />
        </div>
        <div className="shape shape--2">
          <img src="assets/img/shape/f_shape2.png" alt="" />
        </div>
        <div className="shape shape--3">
          <img src="assets/img/shape/f_shape3.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Contact;
