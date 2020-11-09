import axios from "axios";

export async function GetSales(govCode) {
  debugger;

  const { data } = await axios.post(
    "http://10.43.30.182:16797/bi-api/maps/reps",
    govCode
  );
  console.log(data);
  return data;
}

export async function GetMerchants(salesCode) {
  // debugger

  const { data } = await axios.get(
    "http://10.43.30.182:16797/bi-api/maps/merchs",
    salesCode
  );
  console.log(data);
  return data;
}
