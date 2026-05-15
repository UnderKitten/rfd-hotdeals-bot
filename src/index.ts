import axios from "axios";


async function main() {
  const response = await axios.get(
    "https://forums.redflagdeals.com/hot-deals-f9/",
  );

  console.log(response.status);
  console.log(response.data.substring(0, 500));
}

main();
