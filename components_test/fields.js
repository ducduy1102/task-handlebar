import dynamic from "next/dynamic";

const ShortAnswer = dynamic(() => import("./ShortAnswer"));
const Relation = dynamic(() => import("./Relation"));
const BooleanCustom = dynamic(() => import("./Boolean"));
const Slug = dynamic(() => import("./Slug"));
const RadioComp = dynamic(() => import("./Radio"));
const DatePickerComp = dynamic(() => import("./DateAndTime"));
const Number = dynamic(() => import("./Number"));
const FileUpload = dynamic(() => import("./File"));
const TextEditor = dynamic(() => import("./LongAnswer"));
const MultiFile = dynamic(() => import("./MultiFile"));
const fieldName = dynamic(() => import("./fieldName"));

export const Fields = {
  ShortAnswer: ShortAnswer,
  TextEditor: TextEditor,
  BooleanCustom: BooleanCustom,
  UriKeyGen: Slug,
  Relation: Relation,
  RadioComp: RadioComp,
  DatePickerComp: DatePickerComp,
  NumberInput: Number,
  FileUpload: FileUpload,
  fieldName: fieldName,
  MultiFile: MultiFile,
};
