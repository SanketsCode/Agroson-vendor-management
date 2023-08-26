import React, { useEffect, useState } from "react";
import {
  handleFilterTaluka,
  handleFilterDistrict,
  handleFilterVillages,
} from "@/common/Places";
import { countries } from "../documents/country-state.json";
import { toast } from "react-toastify";
import CameraCapture from "../components/CameraCapture";
import { RxCross1 } from "react-icons/rx";
import Loader from "@/layout/Loader";
import axios from "axios";
import { RefreshFunction } from "@/common/Refresh";
export default function Problem_Form() {
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [district, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  //Custom Images
  const [pickedImages, setPickedImages] = useState([]);
  const [selectImage, setSelectImage] = useState(null);

  const [inputFields, setInputFields] = useState({
    farmer_name: "",
    mobile_no: "",
    village: "",
    state: "",
    dist: "",
    country: "",
    pincode: "",
    taluka: "",
    Images: [],
    problem_title: "",
    problem_description: "",
  });

  const handleRemove = (image) => {
    const newImages = pickedImages.filter((file) => file != image);
    setPickedImages(newImages);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputFields({ ...inputFields, [name]: value });
  };

  const handleFilterState = (event) => {
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

    RefreshFunction();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (inputFields.state == "") {
      toast.error("State is Missing");
      return;
    }

    if (pickedImages.length < 1) {
      toast.error("Please add at least 1 image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("farmer_name", inputFields.farmer_name);
    formData.append("mobile_no", inputFields.mobile_no);
    formData.append("village", inputFields.village);
    formData.append("state", inputFields.state);
    formData.append("dist", inputFields.dist);
    formData.append("country", inputFields.country);
    formData.append("pincode", inputFields.pincode);
    formData.append("taluka", inputFields.taluka);
    formData.append("problem_title", inputFields.problem_title);
    formData.append("problem_description", inputFields.problem_description);
    // formData.append("images", pickedImages);
    // console.log(formData.keys);

    pickedImages.map((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/api/v1/problem/create`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        toast.success("Problem Added Successfully");

        setInputFields({
          farmer_name: "",
          mobile_no: "",
          village: "",
          state: inputFields.state,
          dist: "",
          country: inputFields.country,
          pincode: "",
          taluka: "",
          images: [],
          problem_title: "",
          problem_description: "",
        });

        setPickedImages([]);
      }
    } catch (error) {
      toast.error("Error occurred while submitting the form");
      console.log(error);
    } finally {
      setLoading(false);
    }
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
                    आम्हाला तुमची समस्या सांगा
                  </h1>
                  <p className="text-xs text-slate-600 mb-6">
                    आम्ही शक्य तितक्या लवकर तुमची समस्या सोडवण्यासाठी प्रयत्न
                    करतो
                  </p>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6">
                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">प्रतिमा</h1>
                    <hr />
                  </div>

                  {pickedImages.length > 0 &&
                    pickedImages.map((image, key) => {
                      return (
                        <div key={key} className="relative">
                          <RxCross1
                            className="absolute z-10 right-3 top-3"
                            size={34}
                            color="red"
                            onClick={() => handleRemove(image)}
                          />
                          <img src={URL.createObjectURL(image)} />
                        </div>
                      );
                    })}

                  {pickedImages.length <= 3 && (
                    <div className="md:col-span-2 sm:col-span-1">
                      <div className="flex flex-col">
                        <label htmlFor="pincode" className="input-label">
                          प्रतिमा अपलोड करा
                        </label>
                        <input
                          type="file"
                          accept="image/png, image/jpg, image/webp, image/jpeg"
                          name="media"
                          value={selectImage}
                          onChange={(event) => {
                            if (event.target.files.length === 0) {
                              toast.error("File Not Picked");
                            } else {
                              setPickedImages([
                                ...pickedImages,
                                event.target.files[0],
                              ]);
                              setSelectImage(null);
                            }
                          }}
                          className="input-box"
                        />
                      </div>
                    </div>
                  )}

                  {pickedImages.length <= 3 && (
                    <div className="md:col-span-2 sm:col-span-1">
                      <div className="flex flex-col">
                        <CameraCapture
                          pickedImages={pickedImages}
                          setPickedImages={setPickedImages}
                        />
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">समस्या तपशील</h1>
                    <hr />
                  </div>

                  {/* Problem Title */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <div className="flex flex-col">
                      <label htmlFor="name" className="input-label">
                        समस्या शीर्षक
                      </label>

                      <input
                        type="text"
                        value={inputFields.problem_title}
                        onChange={(event) => handleInputChange(event)}
                        name="problem_title"
                        className="input-box"
                        maxLength={50}
                        placeholder="Enter Problem Title"
                        required
                      />
                      <div className="flex w-full justify-end align-bottom">
                        <p className="text-sm mt-1">
                          {inputFields.problem_title.length}/50
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="md:col-span-2 sm:col-span-1">
                    <div className="flex flex-col">
                      <label htmlFor="name" className="input-label">
                        समस्येचे वर्णन
                      </label>
                      <textarea
                        type="text"
                        value={inputFields.problem_description}
                        onChange={(event) => handleInputChange(event)}
                        name="problem_description"
                        className="input-box"
                        placeholder="Enter Problem Description"
                        maxLength={500}
                        required
                      />
                      <div className="flex w-full justify-end align-bottom">
                        <p className="text-sm mt-1">
                          {inputFields.problem_description.length}/800
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">
                      वैयक्तिक माहिती
                    </h1>
                    <hr />
                  </div>

                  {/* Farmer Name */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="input-label">
                      तुमचे नाव*
                    </label>
                    <input
                      type="text"
                      value={inputFields.farmer_name}
                      onChange={(event) => handleInputChange(event)}
                      name="farmer_name"
                      className="input-box"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  {/* Phone Primary */}
                  <div className="flex flex-col">
                    <label htmlFor="primaryPhone" className="input-label">
                      तुमचा मोबाईल. क्रमांक*
                    </label>
                    <input
                      type="number"
                      value={inputFields.mobile_no}
                      onChange={(event) => handleInputChange(event)}
                      name="mobile_no"
                      className="input-box"
                      placeholder="Enter phone"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 sm:col-span-1">
                    <br />
                    <h1 className="font-semibold text-lg mb-2">तुमचा पत्ता</h1>
                    <hr />
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
                      onChange={(event) => {
                        handleInputChange(event);
                        handleFilterDistrict({ event, setDistricts });
                      }}
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

                  {/* dist */}
                  <div className="flex flex-col">
                    <label htmlFor="city" className="input-label">
                      जिल्हा*
                    </label>
                    <select
                      value={inputFields.dist}
                      onChange={(event) => {
                        handleInputChange(event);
                        handleFilterTaluka({ event, inputFields, setTalukas });
                      }}
                      name="dist"
                      className="input-box"
                      required
                    >
                      <option value="">--निवडा--</option>
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
                      तालुका*
                    </label>
                    <select
                      value={inputFields.taluka}
                      onChange={(event) => {
                        handleInputChange(event);
                        handleFilterVillages({
                          event,
                          inputFields,
                          setVillages,
                        });
                      }}
                      name="taluka"
                      className="input-box"
                      required
                    >
                      <option value="">--निवडा--</option>
                      {talukas.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Street */}
                  <div className="flex flex-col">
                    <label htmlFor="street" className="input-label">
                      गाव*
                    </label>
                    <select
                      value={inputFields.village}
                      onChange={(event) => handleInputChange(event)}
                      name="village"
                      className="input-box"
                      required
                    >
                      <option value="">--निवडा--</option>
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
              </figure>
            </div>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
}
