import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Test2 from "./test2";

export default function Test(): JSX.Element {
  const [state, setState] = useState<boolean>(true);

  useEffect(() => {
    setState(false);
  }, []);

  return <>{state ? null : <Test2></Test2>}</>;
}
