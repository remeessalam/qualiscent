import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { companyDetails } from "../data/constant";

const ContactForm2 = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    if (spinner) return;
    setSpinner(true);

    var emailBody = "Name: " + values.fullName + "\n\n";
    emailBody += "Email: " + values.email + "\n\n";
    emailBody += "Subject: " + values.subject + "\n\n";
    emailBody += "Message:\n" + values.message;

    const googleFormData = new URLSearchParams();
    googleFormData.append("Name", values.fullName);
    googleFormData.append("Email", values.email);
    googleFormData.append("Subject", values.subject);
    googleFormData.append("Message", values.message);

    var payload = {
      to: companyDetails.email,
      name: companyDetails?.name || "Qualiscent Infotech",
      subject: values.subject,
      body: emailBody,
    };
    const googleFormURL =
      "https://script.google.com/macros/s/AKfycbzlukNBNQwwYTipMWk0yFduO60yuWKedUSSRK_uPFRruiYrlIQbw1wMwQJYPDw5ETc4qw/exec";
    const resGoogleSheet = await fetch(googleFormURL, {
      method: "POST",
      body: googleFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow",
    });
    console.log(resGoogleSheet, "googlesheetresponse");

    await fetch(
      "https://send-mail-redirect-boostmysites.vercel.app/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Email sent successfully");
          reset();
          navigate("/thank-you");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setSpinner(false));
  };

  return (
    <div className="bg-primary p-6 rounded-xl">
      <form
        data-aos="fade-up"
        className="grid grid-cols-1 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="p-2 outline-none bg-white rounded-xl w-full"
              {...register("fullName", { required: true })}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                Full Name is required
              </span>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="p-2 outline-none bg-white rounded-xl w-full"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email is required</span>
            )}
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            className="p-2 outline-none bg-white rounded-xl w-full"
            {...register("subject", { required: true })}
          />
          {errors.subject && (
            <span className="text-red-500 text-sm">Subject is required</span>
          )}
        </div>
        <div>
          <textarea
            rows="5"
            placeholder="Message"
            className="p-2 outline-none bg-white rounded-xl w-full"
            {...register("message", { required: true })}
          />
          {errors.message && (
            <span className="text-red-500 text-sm">Message is required</span>
          )}
        </div>
        <button type="submit" className="secondary-btn">
          {spinner ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm2;
