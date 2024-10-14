import TextDefault from "./TextDefault";
import TextSetting from "./TextSetting";
const setting = {
  color: {
    displayName: "Text Ne",
    matchIf: [{ types: ["string"], widget: "color" }],
    defaultDataSchema: {
      type: "string",
      widget: "color",
    },
    defaultUiSchema: { "ui:widget": "color" },
    type: "object",
    cardBody: TextDefault,
    modalBody: TextSetting,
  },
};
export default setting;
