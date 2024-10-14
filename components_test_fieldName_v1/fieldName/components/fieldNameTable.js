import { WrapperField } from "@/components/builders/elements";

const fieldNameTable = ({ id, schema, required, onChange, value, props }) => {
  console.log("🚀 ~ fieldNameTable ~ value:", value);
  return (
    <WrapperField
      title={schema?.title}
      description={schema?.description}
      required={required}
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: value }}
      ></div>
    </WrapperField>
  );
};
export default fieldNameTable;
