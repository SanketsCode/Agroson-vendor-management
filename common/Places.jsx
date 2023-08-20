import { countries } from "@/documents/country-state.json";
import { Maharashtra } from "@/documents/villages.json";

export const handleFilterState = ({ event, setState }) => {
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

export const handleFilterDistrict = ({ event, setDistricts }) => {
  setDistricts([]);
  let newDist = [];
  if (event.target.value === "Maharashtra") {
    Maharashtra.map((dist_data) => {
      newDist.push(dist_data.district);
    });
  }
  setDistricts(newDist);
};

export const handleFilterTaluka = ({ event, inputFields, setTalukas }) => {
  setTalukas([]);
  let newTalukas = [];
  if (inputFields.state === "Maharashtra") {
    Maharashtra.map((dist_data) => {
      console.log(event.target.value);

      if (dist_data.district === event.target.value) {
        dist_data.talukas.map((taluka_data) => {
          newTalukas.push(taluka_data.taluka);
        });
      }
    });
  }
  setTalukas(newTalukas);
};

export const handleFilterVillages = ({ event, setVillages, inputFields }) => {
  setVillages([]);
  let Villages = [];
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
