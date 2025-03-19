import nominatim from "nominatim-client";

const client = nominatim.createClient({
  useragent: "YUNeedMoney", // just the app name needed by nominatim
  referer: "http://YUNeedMoney.com", // also needed by nominatim
});
// geocoding an address to get coordinates
// Basically it takes any real address like 123 something something avenue, and turns them to lon/lat
// gonna use OpenStreeMap nominatim for this thing
export async function geocodeAddress(address) {
  if (!address)
    return console.error({
      status: "Error",
      message: "No address provided to geocodeAddress",
    });

  // all of this came from the nominatim npm docmentation thing
  try {
    console.log(address);
    const query = {
      q: address,
      addressdetauls: "1",
    };

    const response = await client.search(query);

    if (response && response.length > 0) {
      return {
        longitude: parseFloat(response[0].lon),
        latitude: parseFloat(response[0].lat),
      };
    }

    return null;
  } catch (err) {
    console.error("Geocoding error using nominatim ", err);
    return null;
  }
}

export default geocodeAddress;
