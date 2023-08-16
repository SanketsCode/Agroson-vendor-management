import axios from "axios";

import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BusinessCategory } from "../documents/BusinessCategory.json";

import { countries } from "../documents/country-state.json";

import Loader from "@/layout/Loader";

interface ServiceType {
  service_name: string;
  rate: string;
}

interface MachineType {
  Machine_name: string;
  rate: string;
}

const CropRegistration = () => {
  const [country, setCountry] = useState<string[] | []>([]);
  const [state, setState] = useState<string[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceType[] | []>([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [machineryName, setMachineryName] = useState("");
  const [machineryRate, setMachineryRate] = useState("");
  const [machines, setMachines] = useState<MachineType[] | []>([]);

  const Refresh = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_PREFIX}`).then((res) => {
      console.log(res);
    });
  };

  const [inputFields, setInputFields] = useState({
    farmer_name: "",
    mobile_no: "",
    village: "",
    taluka: "",
    dist: "",
    pincode: "",
    state: "",
    country: "",
    crop: "",
    plantation_date: null,
    acre: 0,
    guntha: 0,
  });

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setInputFields({ ...inputFields, [name]: value });
  };

  const handleFilterState = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState([]);
    const data = countries.find(({ country }) => {
      if (event.target.value == country) {
        return country;
      }
    });
    if (data) {
      const result = data.states.map((state) => {
        return state;
      });
      setState(result);
    }
  };

  useEffect(() => {
    const data = countries.map(({ country }) => {
      return country;
    });
    setCountry(data);
    Refresh();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (inputFields.state == "") {
      toast.error("State is Missing");
      return;
    }

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_PREFIX}/api/v1/admin/crop`, {
        ...inputFields,
      })
      .then((response) => {
        if (response.status == 200) {
          toast.success("Registration Successfully");

          setInputFields({
            farmer_name: "",
            mobile_no: "",
            village: "",
            taluka: "",
            dist: "",
            pincode: "",
            state: "",
            country: "",
            crop: "",
            acre: 0,
            plantation_date: null,
            guntha: 0,
          });
        }
      })
      .catch((err) => {
        toast.error("ERROR OCCUR");
        console.log(err);
      });

    setLoading(false);
  };

  return (
    <React.Fragment>
      <section className="md:py-20 sm:p-0">
        <div className="md:container sm:w-full">
          <form onSubmit={(event) => handleFormSubmit(event)}>
            <div className="md:w-full sm:w-full md:mx-auto md:py-2">
              <figure className="bg-white p-8 flex flex-col space-y-3 shadow-lg">
                <img src="/assets/logo-dark.png" />
                <div>
                  <h1 className="font-semibold text-2xl mb-2">पिक नोंदणी</h1>
                  <p className="text-xs text-slate-600 mb-6">सर्व जागा भरा</p>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6">
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">
                      शेतकरी माहिती
                    </h1>
                    <hr />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="input-label">
                      शेतकरी नाव*
                    </label>
                    <input
                      type="text"
                      value={inputFields.farmer_name}
                      onChange={(event) => handleInputChange(event)}
                      name="farmer_name"
                      className="input-box"
                      placeholder="नाव"
                      required
                    />
                  </div>

                  {/* Phone Primary */}
                  <div className="flex flex-col">
                    <label htmlFor="primaryPhone" className="input-label">
                      मोबाईल नंबर*
                    </label>
                    <input
                      type="number"
                      value={inputFields.mobile_no}
                      onChange={(event) => handleInputChange(event)}
                      name="mobile_no"
                      className="input-box"
                      placeholder="मोबाईल नंबर"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">तुमचा पत्ता</h1>
                    <hr />
                  </div>

                  {/* Street */}
                  <div className="flex flex-col">
                    <label htmlFor="street" className="input-label">
                      गाव*
                    </label>
                    <input
                      type="text"
                      value={inputFields.village}
                      onChange={(event) => handleInputChange(event)}
                      name="village"
                      className="input-box"
                      placeholder="गावाचे नाव"
                      required
                    />
                  </div>

                  {/* dist */}
                  <div className="flex flex-col">
                    <label htmlFor="city" className="input-label">
                      जिल्हा*
                    </label>
                    <input
                      type="text"
                      value={inputFields.dist}
                      onChange={(event) => handleInputChange(event)}
                      name="dist"
                      className="input-box"
                      placeholder="जिल्हा"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="city" className="input-label">
                      तालुका*
                    </label>
                    <input
                      type="text"
                      value={inputFields.taluka}
                      onChange={(event) => handleInputChange(event)}
                      name="taluka"
                      className="input-box"
                      placeholder="तालुका"
                      required
                    />
                  </div>

                  {/* Pincode */}
                  <div className="flex flex-col">
                    <label htmlFor="pincode" className="input-label">
                      पिनकोड*
                    </label>
                    <input
                      type="text"
                      value={inputFields.pincode}
                      onChange={(event) => handleInputChange(event)}
                      name="pincode"
                      className="input-box"
                      placeholder="पिनकोड"
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="flex flex-col">
                    <label htmlFor="country" className="input-label">
                      देश*
                    </label>
                    <select
                      name="country"
                      className="input-box"
                      onChange={(event) => {
                        handleFilterState(event);
                        handleInputChange(event);
                      }}
                      id="country"
                      required
                    >
                      <option value="">--निवडा--</option>
                      {country.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* State */}
                  <div className="flex flex-col">
                    <label htmlFor="state" className="input-label">
                      राज्य*
                    </label>
                    <select
                      name="state"
                      className="input-box"
                      onChange={(event) => handleInputChange(event)}
                      id="state"
                      required
                    >
                      <option value="">--निवडा--</option>
                      {state.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Select Crop  */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">पिक माहिती</h1>
                    <hr />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessCategory" className="input-label">
                      पिक निवडा*
                    </label>
                    <select
                      name="crop"
                      className="input-box"
                      id="crop"
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                    >
                      <option value="">--निवडा--</option>

                      <option key={0} value={"sugarcane"}>
                        ऊस (Sugarcane)
                      </option>
                      <option key={0} value={"ginger"}>
                        आल(Ginger)
                      </option>
                      <option key={0} value={"turmeric"}>
                        हळद (Turmeric)
                      </option>
                      <option key={0} value={"rice"}>
                        भात (Rice)
                      </option>
                      <option key={0} value={"wheat"}>
                        गहु (Wheat)
                      </option>
                      <option key={0} value={"soyabean"}>
                        सोयाबीन (Soyabean)
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessCategory" className="input-label">
                      पिक लागवड दिनांक *
                    </label>
                    <input
                      type="date"
                      value={
                        inputFields.plantation_date
                          ? inputFields.plantation_date
                          : ""
                      }
                      onChange={(event) => handleInputChange(event)}
                      name="plantation_date"
                      className="input-box"
                      required
                    />
                  </div>

                  {/* Services  */}

                  {/* Select Crop  */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">
                      क्षेत्र माहिती
                    </h1>
                    <hr />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="name" className="input-label">
                      एकर
                    </label>
                    <input
                      type="text"
                      value={inputFields.acre}
                      onChange={(event) => handleInputChange(event)}
                      name="acre"
                      className="input-box"
                      placeholder="Enter Area In Acre"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessName" className="input-label">
                      गुंठा
                    </label>
                    <input
                      type="text"
                      value={inputFields.guntha}
                      onChange={(event) => handleInputChange(event)}
                      name="guntha"
                      className="input-box"
                      placeholder="Enter Area In Guntha"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      disabled={loading}
                      type="submit"
                      className="btn-theme-5 w-full"
                    >
                      <span className="w-full">
                        {loading ? <Loader /> : "Register"}
                      </span>
                    </button>
                  </div>
                </div>
              </figure>
            </div>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default CropRegistration;
