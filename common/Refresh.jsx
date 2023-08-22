import axios from "axios";

export const RefreshFunction = async () => {
  await axios.get(`${process.env.NEXT_PUBLIC_API_PREFIX}`).then((res) => {
    console.log(res);
  });
};
