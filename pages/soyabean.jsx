import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Soyabean() {
  const [inputFields, setInputFields] = useState({
    farmer_name: "",
    contact_no: "",
    address: "",
    pincode: "",
    acre: 0,
    date: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputFields({ ...inputFields, [name]: value });
  };

  const SubmitForm = async () => {
    if (inputFields.farmer_name.length < 4) {
      toast.error("कृपया नाव बरोबर लिहा");
      return;
    }

    if (inputFields.contact_no.length !== 10) {
      toast.error("कृपया मोबाईल नंबर बरोबर टाका");
      return;
    }

    if (inputFields.acre <= 0) {
      toast.error("कृपया क्षेत्र भरा");
      return;
    }

    if (inputFields.pincode.length !== 6) {
      toast.error("पिनकोड वैद्य नाही");
      return;
    }

    if (inputFields.address.length < 5) {
      toast.error("कृपया पत्ता बरोबर भरा");
      return;
    }

    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_PREFIX}/api/v1/website/soyabeanform`,
          { ...inputFields, data: new Date(inputFields.date) }
        )
        .then((res) => {
          toast.success("जतन झाले");
          setInputFields({
            farmer_name: "",
            contact_no: "",
            address: "",
            pincode: "",
            acre: 0,
            date: null,
          });
        });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("काही वेळाने प्रयत्न करा");
      }
    }
  };

  return (
    <div className="flex lg:flex-row flex-col bg-white h-[100%] w-[100%]">
      <img
        src="/assets/harvester.jpg"
        className="h-[100vh] w-[40%] sm:hidden lg:block"
      />
      <div className="lg:w-[60%] w-full flex flex-col items-center py-5 space-y-5">
        <img src="/assets/logo-dark.png" className="max-w-[20vw]" />
        <img
          src="/assets/harvester.jpg"
          className="h-[30vh] w-[90vw]  lg:hidden sm:block"
        />
        <div className="bg-[#378F00] py-5 px-7 rounded-md lg:w-[30vw] w-[90vw]  text-center">
          <p className="text-white text-3xl">सोयाबीन काढणी सेवा नोंदणी</p>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 w-full p-10">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-base font-semibold text-slate-800 mb-2 text-left"
            >
              नाव
            </label>

            <input
              type="text"
              value={inputFields.farmer_name}
              onChange={(event) => handleInputChange(event)}
              name="farmer_name"
              className="text-xl px-7 py-4 font-medium text-black bg-white border border-[#378F00] rounded-lg focus:border-[#378F00]"
              placeholder="नाव"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-base font-medium text-slate-800 mb-2 text-left"
            >
              फोन नंबर
            </label>

            <input
              type="text"
              value={inputFields.contact_no}
              onChange={(event) => handleInputChange(event)}
              name="contact_no"
              className="text-xl px-7 py-4 font-medium text-black bg-white border border-[#378F00] rounded-lg focus:border-[#378F00]"
              placeholder="फोन नंबर"
              required
            />
          </div>

          <div className="flex flex-col lg:col-span-2 col-span-1">
            <label
              htmlFor="name"
              className="text-base font-medium text-slate-800 mb-2 text-left"
            >
              पत्ता
            </label>

            <input
              type="text"
              value={inputFields.address}
              onChange={(event) => handleInputChange(event)}
              name="address"
              className="text-xl px-7 py-4 font-medium text-black bg-white border border-[#378F00] rounded-lg focus:border-[#378F00]"
              placeholder="पत्ता"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-base font-medium text-slate-800 mb-2 text-left"
            >
              पिन कोड
            </label>

            <input
              type="text"
              value={inputFields.pincode}
              onChange={(event) => handleInputChange(event)}
              name="pincode"
              className="text-xl px-7 py-4 font-medium text-black bg-white border border-[#378F00] rounded-lg focus:border-[#378F00]"
              placeholder="पिन कोड"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-base font-medium text-slate-800 mb-2 text-left"
            >
              कामाचे क्षेत्र
            </label>

            <input
              type="number"
              value={inputFields.acre}
              onChange={(event) => handleInputChange(event)}
              name="acre"
              className="text-xl px-7 py-4 font-medium text-black bg-white border border-[#378F00] rounded-lg focus:border-[#378F00]"
              placeholder="कामाचे क्षेत्र(एकर)"
              required
            />
          </div>

          <div className="flex flex-col lg:col-span-2 col-span-1">
            <label
              htmlFor="name"
              className="text-base font-medium text-slate-800 mb-2 text-left"
            >
              पिक काढणी तारीख
            </label>

            <input
              type="date"
              value={inputFields.date}
              onChange={(event) => handleInputChange(event)}
              name="date"
              className="text-xl px-7 py-4 font-medium text-black bg-white border border-[#378F00] rounded-lg focus:border-[#378F00] w-full"
              placeholder="पिक काढणी तारीख"
              required
            />
          </div>
        </div>
        <div
          onClick={() => SubmitForm()}
          className="bg-[#378F00] py-5 lg:w-[20vw] w-[90vw] text-center text-white text-2xl cursor-pointer hover:bg-[#487f28]"
        >
          पाठवा
        </div>
      </div>
    </div>
  );
}
