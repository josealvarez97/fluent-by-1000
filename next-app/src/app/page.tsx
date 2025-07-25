import React from "react";
import EarlyPrototypePageV1 from "./EarlyPrototype/EarlyPrototypeV1";
import EarlyPrototypePageV2 from "./EarlyPrototype/EarlyPrototypeV2";
import EarlyPrototypePageV3 from "./EarlyPrototype/EarlyPrototypeV3";

const HomePage = () => {
  return (
    <>
      <EarlyPrototypePageV3 />;
      <EarlyPrototypePageV2 />;
      <EarlyPrototypePageV1 />;
    </>
  );
};

export default HomePage;
