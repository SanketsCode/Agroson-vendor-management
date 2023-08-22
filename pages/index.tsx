import axios from "axios";

import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BusinessCategory } from "../documents/BusinessCategory.json";
import { Maharashtra } from "@/documents/villages.json";

import { countries } from "../documents/country-state.json";
import { RefreshFunction } from "@/common/Refresh";
import Loader from "@/layout/Loader";
import ServiceCard from "@/components/serviceCard";

interface ServiceType {
  service_name: string;
  rate: string;
}

interface MachineType {
  Machine_name: string;
  rate: string;
}

const Register = () => {
  const [country, setCountry] = useState<string[] | []>([]);
  const [state, setState] = useState<string[] | []>([]);
  const [district, setDistricts] = useState<string[] | []>([]);
  const [talukas, setTalukas] = useState<string[] | []>([]);
  const [villages, setVillages] = useState<string[] | []>([]);
  const [categories, setCategories] = useState<string[] | []>([]);
  const [subCategories, setSubCategories] = useState<string[] | []>([]);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceType[] | []>([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [machineryName, setMachineryName] = useState("");
  const [machineryRate, setMachineryRate] = useState("");
  const [machines, setMachines] = useState<MachineType[] | []>([]);

  const [inputFields, setInputFields] = useState({
    name: "",
    email: "",
    alternative_phone: "",
    contact: "",
    village: "",
    taluka: "",
    dist: "",
    pincode: "",
    state: "",
    country: "",
    machinery: machines,
    services: services,
    ServiceCategory: "",
    ServiceSubCategory: "",
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

  const handleFilterDistrict = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDistricts([]);
    let newDist: string[] = [];
    if (event.target.value === "Maharashtra") {
      Maharashtra.map((dist_data) => {
        newDist.push(dist_data.district);
      });
    }
    setDistricts(newDist);
  };

  const handleFilterTaluka = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTalukas([]);
    let newTalukas: string[] = [];
    if (inputFields.state === "Maharashtra") {
      Maharashtra.map((dist_data) => {
        console.log(event.target.value);

        if (dist_data.district === event.target.value) {
          console.log(dist_data.talukas);
          dist_data.talukas.map((taluka_data) => {
            newTalukas.push(taluka_data.taluka);
          });
        }
      });
    }
    setTalukas(newTalukas);
  };

  const handleFilterVillages = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setVillages([]);
    let Villages: string[] = [];
    if (inputFields.state === "Maharashtra") {
      Maharashtra.map((dist_data) => {
        if (dist_data.district === inputFields.dist) {
          dist_data.talukas.map((taluka_data) => {
            if (taluka_data.taluka === event.target.value) {
              taluka_data.villages.map((village) => {
                Villages.push(village);
              });
            }
          });
        }
      });
    }
    setVillages(Villages);
  };

  // for services
  const handleServices = () => {
    if (serviceName == "" || serviceRate == "") {
      toast.error("Fill All Field for Service");
      return;
    }

    // if (inputFields.state == "") {
    //   toast.error("State is not selected");
    //   return;
    // }

    // if (inputFields.country == "") {
    //   toast.error("country is missing");
    //   return;
    // }

    const service = {
      service_name: serviceName,
      rate: serviceRate,
    };

    setServices([...services, service]);
    setServiceName("");
    setServiceRate("");
  };

  const deleteService = (service_name: string) => {
    const filteredServices = services.filter(
      (data) => data.service_name !== service_name
    );
    setServices(filteredServices);
  };

  // for machineries
  const handleMachines = () => {
    if (machineryName == "" || machineryRate == "") {
      toast.error("Fill All Field for Machines");
      return;
    }
    const machine = {
      Machine_name: machineryName,
      rate: machineryRate,
    };

    setMachines([...machines, machine]);
    setMachineryName("");
    setMachineryRate("");
  };

  const deleteMachine = (machine_name: string) => {
    const filteredMachines = machines.filter(
      (data) => data.Machine_name !== machine_name
    );
    setMachines(filteredMachines);
  };

  const handleFilterSubCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSubCategories([]);
    const data = BusinessCategory.find(({ category }) => {
      if (event.target.value == category) {
        return category;
      }
    });
    if (data) {
      const result = data.subCategory.map((sub) => {
        return sub;
      });

      setSubCategories(result);
    }
  };

  useEffect(() => {
    const data = countries.map(({ country }) => {
      return country;
    });
    setCountry(data);

    const myCategories = BusinessCategory.map(({ category }) => {
      return category;
    });
    setCategories(myCategories);

    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });

    RefreshFunction();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (services.length) {
      inputFields.services = services;
    }

    if (machines.length) {
      inputFields.machinery = machines;
    }

    if (inputFields.state == "") {
      toast.error("State is Missing");
      return;
    }

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_PREFIX}/api/v1/vendor/register`, {
        lat,
        long: lon,
        ...inputFields,
      })
      .then((response) => {
        // console.log(response);
        if (response.status == 200) {
          toast.success("Vendor Created Successfully");
          setServices([]);
          setMachines([]);

          inputFields.name = "";
          inputFields.contact = "";
          inputFields.alternative_phone = "";
          inputFields.email = "";
          inputFields.machinery = [];
          inputFields.services = [];
          inputFields.ServiceCategory = "";
          inputFields.ServiceSubCategory = "";
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Email and Number Already exist");
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
                <img
                  className="w-[300px] h-[200px]"
                  src="/assets/logo-dark.png"
                />
                <div>
                  <h1 className="font-semibold text-2xl mb-2">
                    Register as a Vendor
                  </h1>
                  <p className="text-xs text-slate-600 mb-6">
                    Please fill the required fields to create a designer account
                  </p>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6">
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">
                      Personal Information
                    </h1>
                    <hr />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="input-label">
                      Your name*
                    </label>
                    <input
                      type="text"
                      value={inputFields.name}
                      onChange={(event) => handleInputChange(event)}
                      name="name"
                      className="input-box"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  {/* Email address */}
                  <div className="flex flex-col">
                    <label htmlFor="email" className="input-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={inputFields.email}
                      onChange={(event) => handleInputChange(event)}
                      name="email"
                      className="input-box"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Phone Primary */}
                  <div className="flex flex-col">
                    <label htmlFor="primaryPhone" className="input-label">
                      Contact*
                    </label>
                    <input
                      type="number"
                      value={inputFields.contact}
                      onChange={(event) => handleInputChange(event)}
                      name="contact"
                      className="input-box"
                      placeholder="Enter phone"
                      required
                    />
                  </div>

                  {/* Phone Primary */}
                  <div className="flex flex-col">
                    <label htmlFor="primaryPhone" className="input-label">
                      Secondary Phone
                    </label>
                    <input
                      type="number"
                      value={inputFields.alternative_phone}
                      onChange={(event) => handleInputChange(event)}
                      name="alternative_phone"
                      className="input-box"
                      placeholder="Enter phone"
                    />
                  </div>

                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">
                      Address Information
                    </h1>
                    <hr />
                  </div>

                  {/* Country */}
                  <div className="flex flex-col">
                    <label htmlFor="country" className="input-label">
                      Country*
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
                      <option value="">Select Country</option>
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
                      State*
                    </label>
                    <select
                      name="state"
                      className="input-box"
                      onChange={(event) => {
                        handleInputChange(event);
                        handleFilterDistrict(event);
                      }}
                      id="state"
                      required
                    >
                      <option value="">Select State</option>
                      {state.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* dist */}
                  <div className="flex flex-col">
                    <label htmlFor="city" className="input-label">
                      District*
                    </label>
                    <select
                      value={inputFields.dist}
                      onChange={(event) => {
                        handleInputChange(event);
                        handleFilterTaluka(event);
                      }}
                      name="dist"
                      className="input-box"
                      required
                    >
                      <option value="">Select District</option>
                      {district.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="city" className="input-label">
                      Taluka*
                    </label>
                    <select
                      value={inputFields.taluka}
                      onChange={(event) => {
                        handleInputChange(event);
                        handleFilterVillages(event);
                      }}
                      name="taluka"
                      className="input-box"
                      required
                    >
                      <option value="">Select Taluka</option>
                      {talukas.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Village */}
                  <div className="flex flex-col">
                    <label htmlFor="street" className="input-label">
                      Village*
                    </label>
                    <select
                      value={inputFields.village}
                      onChange={(event) => handleInputChange(event)}
                      name="village"
                      className="input-box"
                      required
                    >
                      <option value="">Select Village</option>
                      {villages.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Pincode */}
                  <div className="flex flex-col">
                    <label htmlFor="pincode" className="input-label">
                      Pincode*
                    </label>
                    <input
                      type="text"
                      value={inputFields.pincode}
                      onChange={(event) => handleInputChange(event)}
                      name="pincode"
                      className="input-box"
                      placeholder="Enter pincode"
                      required
                    />
                  </div>

                  {/* Select Service  */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">
                      Service Information
                    </h1>
                    <hr />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessCategory" className="input-label">
                      Select Category*
                    </label>
                    <select
                      name="ServiceCategory"
                      className="input-box"
                      id="ServiceCategory"
                      onChange={(event) => {
                        handleFilterSubCategory(event);
                        handleInputChange(event);
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessCategory" className="input-label">
                      Select subCategory*
                    </label>
                    <select
                      name="ServiceSubCategory"
                      className="input-box"
                      id="ServiceSubCategory"
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                    >
                      <option value="">Select SubCategory</option>
                      {subCategories.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Services  */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <div className="my-2">
                      <h1 className="font-semibold text-lg ">
                        Add Other Services
                      </h1>
                      <p className="text-[10px]">You Can add Service here</p>
                    </div>
                    <hr />
                  </div>

                  {services.length > 0 &&
                    services.map((data) => (
                      <ServiceCard
                        key={data.service_name}
                        serviceName={data.service_name}
                        handleDelete={deleteService}
                        serviceRate={data.rate}
                      />
                    ))}

                  <div className="flex flex-col">
                    <label htmlFor="name" className="input-label">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(event) => setServiceName(event.target.value)}
                      name="name"
                      className="input-box"
                      placeholder="Enter Service Name"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessName" className="input-label">
                      Service Rate
                    </label>
                    <input
                      type="text"
                      value={serviceRate}
                      onChange={(event) => setServiceRate(event.target.value)}
                      name="name"
                      className="input-box"
                      placeholder="Enter Rate"
                    />
                  </div>

                  <div
                    className="btn-theme-5 md:w-[25%] w-full"
                    onClick={handleServices}
                  >
                    <span className="w-full">Add Service</span>
                  </div>

                  {/* Machinery  */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <div className="my-2">
                      <h1 className="font-semibold text-lg ">
                        Add Machineries
                      </h1>
                      <p className="text-[10px]">
                        You Can add Machineries here
                      </p>
                    </div>
                    <hr />
                  </div>

                  {machines.length > 0 &&
                    machines.map((data) => (
                      <ServiceCard
                        key={data.Machine_name}
                        serviceName={data.Machine_name}
                        handleDelete={deleteMachine}
                        serviceRate={data.rate}
                      />
                    ))}

                  <div className="flex flex-col">
                    <label htmlFor="name" className="input-label">
                      Machine Name
                    </label>
                    <input
                      type="text"
                      value={machineryName}
                      onChange={(event) => setMachineryName(event.target.value)}
                      name="name"
                      className="input-box"
                      placeholder="Enter Service Name"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="BusinessName" className="input-label">
                      Machine Rate
                    </label>
                    <input
                      type="text"
                      value={machineryRate}
                      onChange={(event) => setMachineryRate(event.target.value)}
                      name="name"
                      className="input-box"
                      placeholder="Enter Rate"
                    />
                  </div>

                  <div
                    className="btn-theme-5 md:w-[25%] w-full"
                    onClick={handleMachines}
                  >
                    <span className="w-full h-full">Add Machine</span>
                  </div>

                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <div className="my-2">
                      <h1 className="font-semibold text-lg ">
                        Location Information
                      </h1>
                      <p className="text-[10px]">
                        It is automatically picked up if not then please allow
                        location for this website and refresh the page
                      </p>
                    </div>
                    <hr />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="BusinessName" className="input-label">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={lat}
                      name="latitude"
                      className="input-box"
                      placeholder="Enter Latitude"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="longitude" className="input-label">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={lon}
                      name="longitude"
                      className="input-box"
                      placeholder="Enter Logitude"
                      required
                    />
                  </div>

                  <div className="flex items-center md:col-span-2 sm:col-span-1">
                    <input type="checkbox" name="accept" required />
                    <label
                      htmlFor="accept"
                      className="text-sm text-slate-600 font-medium"
                    >
                      I accept terms & conditions{" "}
                      <a
                        target={"_blank"}
                        href="https://live-decor-frontend.vercel.app/terms-conditions"
                        className="font-medium text-sm text-ascent-2"
                      >
                        (View)
                      </a>
                    </label>
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

export default Register;
