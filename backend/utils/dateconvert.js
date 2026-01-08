// export function dateToJSONTransformer(schema) {
//   schema.set("toJSON", {
//     transform: function (doc, ret) {
//       function convertDates(obj) {
//         if (!obj) return;

//         Object.keys(obj).forEach((key) => {
//           const value = obj[key];

//           if (value instanceof Date) {
//             obj[key] = value.toISOString().split("T")[0];
//           } else if (typeof value === "object") {
//             convertDates(value);
//           }
//         });
//       }

//       convertDates(ret);
//       return ret;
//     },
//   });
// }


export function dateToJSONTransformer(schema) {
  schema.set("toJSON", {
    transform: function (doc, ret) {

      const SKIP_KEYS = ["createdAt", "updatedAt"];

      function convertDates(obj) {
        if (!obj || typeof obj !== "object") return;

        Object.keys(obj).forEach((key) => {
          if (SKIP_KEYS.includes(key)) return;

          const value = obj[key];

          if (value instanceof Date) {
            obj[key] = value.toISOString().split("T")[0];
          } else if (typeof value === "object") {
            convertDates(value);
          }
        });
      }

      convertDates(ret);
      return ret;
    },
  });
}
