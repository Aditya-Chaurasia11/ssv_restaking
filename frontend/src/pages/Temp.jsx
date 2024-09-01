import React, { useEffect } from "react";
import { useWriteContract } from "wagmi";
import { useReadContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { http, createConfig } from "@wagmi/core";
import { mainnet, holesky } from "@wagmi/core/chains";

import { abi } from "./abi";

export function MintNFT() {
  const get = async () => {
    const result = await readContract(
      createConfig({
        chains: [mainnet, holesky],
        transports: {
          [mainnet.id]: http(),
          [holesky.id]: http(),
        },
      }),
      {
        abi,
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        functionName: "transferFrom",
        args: [
          "0xfddD2b8D9aaf04FA583CCF604a2De12668200582",
          "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
          0n,
        ],
      }
    );
    if (result) console.log("as",result);
  };

  useEffect(() => {
    get();
  }, []);

  return <>asaf</>;
}
