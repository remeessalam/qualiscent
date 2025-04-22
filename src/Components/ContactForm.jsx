import React, { useState } from "react";
import { useForm } from "react-hook-form";
import HrLine from "./HrLine";
import { TiArrowBack } from "react-icons/ti";
import { ImPhone } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { companyDetails } from "../data/constant";
import toast from "react-hot-toast";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);

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
    <div id="contact" className="wrapper pt-[5rem]">
      <div className="grid md:grid-cols-[55%_auto] gap-7">
        <div data-aos="fade-up" data-aos-offset="-1000">
          <div className="space-y-4 text-start">
            <p className="uppercase text-primary">request a quote</p>
            <h3 className="section-heading">
              Need A Free Quote? Please Feel Free to Contact Us
            </h3>
            <HrLine />
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-3 sm:gap-5">
            <div className="">
              <TiArrowBack size={25} className="inline -mt-2 text-primary" />
              <span className="font-bold ml-2">Reply within 24 hours</span>
            </div>
            <div className="">
              <ImPhone size={20} className="inline -mt-2 text-primary" />
              <span className="font-bold ml-2">24 hrs telephone support</span>
            </div>
          </div>
          <p className="mt-5">
            I'd be happy to provide you with a free quote! However, I would need
            more information about what you need a quote for. Please provide
            details about the product or service you're interested in, any
            specific requirements, and any other relevant information, so I can
            assist you in generating an accurate quote.
          </p>
          <div className="mt-7 flex gap-3 sm:justify-center sm:w-fit w-full">
            <div className="bg-primary rounded-xl h-full aspect-square flex justify-center items-center p-3">
              <ImPhone size={25} className="text-white" />
            </div>
            <div className="flex flex-col capitalize">
              <p className="">Call to ask any question</p>
              <Link
                to={`tel:${companyDetails.phone}`}
                className="font-semibold"
              >
                {companyDetails.phone}
              </Link>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-aos="fade-up"
          data-aos-offset="-1000"
          className="bg-primary p-7 space-y-3 rounded-xl"
        >
          <div>
            <input
              type="text"
              {...register("fullName", { required: true })}
              className="w-full p-2 bg-primary-5 outline-none rounded-xl"
              placeholder="Full Name*"
            />
            {errors.fullName && (
              <span className="text-white text-sm">Full name is required</span>
            )}
          </div>
          <div>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full p-2 bg-primary-5 outline-none rounded-xl"
              placeholder="Email*"
            />
            {errors.email && (
              <span className="text-white text-sm">Email is required</span>
            )}
          </div>
          <div>
            <input
              type="text"
              {...register("subject", { required: true })}
              className="w-full p-2 bg-primary-5 outline-none rounded-xl"
              placeholder="Subject*"
            />
            {errors.subject && (
              <span className="text-white text-sm">Subject is required</span>
            )}
          </div>
          <div>
            <textarea
              rows="5"
              {...register("message", { required: true })}
              className="w-full p-2 bg-primary-5 outline-none rounded-xl"
              placeholder="Message*"
            />
            {errors.message && (
              <span className="text-white text-sm">Message is required</span>
            )}
          </div>
          <button type="submit" className="secondary-btn w-full">
            {spinner ? "Sending..." : "Request A Quote"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
