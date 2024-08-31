import { SSVKeys, KeyShares, KeySharesItem, SSVKeysException } from "ssv-keys";
import React, { useEffect, useState } from "react";
// import keystore from "./a.json";
import { useLocation } from "react-router-dom";

// Example operator keys and IDs
// const operatorKeys = [
//   "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBMVg2MUFXY001QUNLaGN5MTlUaEIKby9HMWlhN1ByOVUralJ5aWY5ZjAyRG9sd091V2ZLLzdSVUlhOEhEbHBvQlVERDkwRTVQUGdJSy9sTXB4RytXbwpwQ2N5bTBpWk9UT0JzNDE5bEh3TzA4bXFja1JsZEg5WExmbmY2UThqWFR5Ym1yYzdWNmwyNVprcTl4U0owbHR1CndmTnVTSzNCZnFtNkQxOUY0aTVCbmVaSWhjRVJTYlFLWDFxbWNqYnZFL2cyQko4TzhaZUgrd0RzTHJiNnZXQVIKY3BYWG1uelE3Vlp6ZklHTGVLVU1CTTh6SW0rcXI4RGZ4SEhSeVU1QTE3cFU4cy9MNUp5RXE1RGJjc2Q2dHlnbQp5UE9BYUNzWldVREI3UGhLOHpUWU9WYi9MM1lnSTU4bjFXek5IM0s5cmFreUppTmUxTE9GVVZzQTFDUnhtQ2YzCmlRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
//   "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBeUtVWTVEUmZZREljengzcjhVY0UKTlpFMFdIQXFuV2FIRjZYRlUydVdObjVOVE94Zkt4ZmZaLzkyeVE1citQVkJPRmQrcHhILzI2QXJVT3dNL1lBRQpRbDZ0VzBtc1FqdUtIU1Q4aUtvTDRTNUt0aDNoeTBqeFRHR1ZZaWdjWG1vRURjd2YxaG8wdWRxRmlEN3dFWXN1CmZHa2E2U1ZQNnBab1NMaU9HZFRKUWVzVDI5WEVCdDZnblhMaFB1MER2K0xsQUJJQ1pqWEFTZWtpSFVKUHRjYlgKRjZFL0lScGpkWHVNSmUyOXZDcmZudXhWWk93a1ptdzJXdGljYlNDOVJpSFRYWUQ1dnVGakZXRHNZMERHUDhzOAoyc1haVHdsNWl4dEhlUWM2N1lLRFN6YU1MNnY1VUVZblhUTzZzNHFVSWVnTXJwZjd3S0xGVWxqRTMwbnNIaVBUCjBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
//   "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBNWVUNUwwV0h6ZTdyTWZPb2xtVHMKdWtIQ2E4K3dtbUw2OTFJQ1RpREE1UkJ1TkxqSVQ2WkE0YzMxcVRIY3FBVHl5eVkwLzk3R3lKZ2doYnlFR2RoZQovalh6aWVTOXJ2RytJVGF1QjhMVlhkekxGYVQxWEZWeFlnN2x2TlB4OURPL1ZoRkhkWWxnT3I2d0RtV3FjRGo3ClhWUWFOWEFtRng3NjVQNTlXNXZzVGRXVWFHRWxXSm93SkZKdnc2UlRISkZ1TVhjSzZVaWJ0cUZMSmJwOW5kdUgKQjlLSzNWcmYrZmtJOWRBZ2txRDFHOElxQ0tKMVl3bjUyeGxxbTRCNitOOGZUZE1MS1JucWpFZmRzV1dwMFVzMQpLTW9vSXcyc3BoaXAzUFpNYnJaaU0wNjJ2ZUo0U3ovYjBObWdPTnhTd0JJTnNxcG54QjhFUVQxSTNjNklqNXhhCm5RSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
//   "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdXZleUpUMURwM21mQ3FRTUora2YKZHdhV0d1bkRURUFaWmNTOHdtUTJBcjU1bE5venl5cHRwb1lGSTgxaW1RSmpwdVV0akR2am15RDRQSmt1SzFXRQovZG9TSzFraWlTSEYvZFBaeE5ZT2swMlRiTGIvTXBjMG12VE1nZmRsVDBoTlVOWDZIMnJzZzNlc2NEOStENEdDCmxtZGpCdmdxUDQydXdDbFlQUVhuN3Z6OWlOOEpXdEFtd1JkQ25USkZ6M2tYSEFPVGMyMjJGYXp4ZGJVNEVPYkIKVmJNejd2UXRmMWtNSGtacEh5UXNpL3F0WmhQaThtTlNQTWpMTDBtcmc4Ly9xVjIyeEVPNENmSHFKZkZOWEhKVwpEbU85M2h2QXE2dDFZOGN5UVZkSGZ2WEp5VzRxR29MY25HZzV1S2ZSYWVCSSt1aXFSeExOL2dtTnA2RzdpZVNkCkl3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
// ];
// const operatorIds = [1, 2, 3, 4];
// const keystorePassword = "Maniveer198@";
const TEST_OWNER_NONCE = 1;
const TEST_OWNER_ADDRESS = "0xfddD2b8D9aaf04FA583CCF604a2De12668200582";

const Temp3 = () => {
  const location = useLocation();
  const data = location.state;
  const [operatorIds, setOperatorIDs] = useState([]);
  const [operatorKeys, setOperatorKeys] = useState([]);
  const [keystore, setKeyStore] = useState(null);
  const [keystorePassword, setKeystorePassword] = useState("");

  async function main() {
    // 1. Initialize SSVKeys SDK and read the keystore file
    const ssvKeys = new SSVKeys();
    const { publicKey, privateKey } = await ssvKeys.extractKeys(
      keystore,
      keystorePassword
    );

    const operators = operatorKeys.map((operatorKey, index) => ({
      id: operatorIds[index],
      operatorKey,
    }));

    // 2. Build shares from operator IDs and public keys
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    const keySharesItem = new KeySharesItem();
    //   console.log(keySharesItem.toJson()); // Log the data to the console
    await keySharesItem.update({ operators });
    //   console.log(keySharesItem.toJson()); // Log the data to the console again after update

    await keySharesItem.update({
      ownerAddress: TEST_OWNER_ADDRESS,
      ownerNonce: TEST_OWNER_NONCE,
      publicKey,
    });
    //   console.log(keySharesItem.toJson()); // Log updated data

    // 3. Build final web3 transaction payload and update keyshares file with payload data
    await keySharesItem.buildPayload(
      {
        publicKey,
        operators,
        encryptedShares,
      },
      {
        ownerAddress: TEST_OWNER_ADDRESS,
        ownerNonce: TEST_OWNER_NONCE,
        privateKey,
      }
    );

    const keyShares = new KeyShares();
    keyShares.add(keySharesItem);

    // Log the final key shares data instead of saving to a file
    console.log(keyShares.toJson());
  }

  useEffect(() => {
    // void main();
    console.log("getting data", data);
    if (data) {
      setOperatorIDs(data?.receivedData.operatorIds);
      setOperatorKeys(data?.operatorKey);
      setKeystorePassword(data?.filesData[0].password);
      const jsonContent = JSON.parse(data?.filesData[0].file.content);
      // console.log(JSON.stringify(jsonContent, null, 2));
      // console.log(JSON.stringify(jsonContent, null, 2));
      if (jsonContent) setKeyStore(JSON.stringify(jsonContent, null, 2));
    }
  }, [data]);

  useEffect(() => {
    if (operatorIds && operatorKeys && keystore && keystorePassword) {
      void main();
    }
  }, [operatorIds, operatorKeys, keystore, keystorePassword]);

  return <div>Temp3</div>;
};

export default Temp3;
