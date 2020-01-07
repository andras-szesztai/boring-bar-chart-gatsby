// import { useEffect, useState } from "react";
// import { validateData } from "../utils/chartHelpers";

// export default function useInit({
//   data,
//   width,
//   initVis,
//   brushSelection = true,
//   onlyNull,
//   validateDataParams
// }) {
//   const [init, setInit] = useState(false);
//   const [initValidValues, setInitValidValues] = useState({
//     validData: undefined,
//     data: undefined,
//     onlyNull: undefined,
//     nullValues: undefined
//   });
//   useEffect(() => {
//     if (!onlyNull && width && !init && data && brushSelection) {
//       const validateObject = validateData(validateDataParams);
//       !!validateObject.validData && initVis();
//       setInit(true);
//       setInitValidValues(validateObject)
//     }
//   }, [
//     brushSelection,
//     data,
//     init,
//     initVis,
//     onlyNull,
//     setInit,
//     validateDataParams,
//     width
//   ]);
//   // useEffect(() => {
//   //   (!!onlyNull || !dataCheck) && !!init && setInit(false);
//   // }, [init, onlyNull, setInit]);

//   return {init, initValidValues};
// }
