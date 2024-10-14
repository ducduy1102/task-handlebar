import { WrapperField } from '@/components/builders/elements'; import {
SketchPicker } from 'react-color'; const
ColorEdit
= ({ id, schema, required, onChange, value, props }) => { const
handleChangeComplete = (color) => { onChange(color.hex); }; return (
<WrapperField
  title="{schema?.title}"
  description="{schema?.description}"
  required="{required}"
>
  <SketchPicker color="{value}" onChangeComplete="{handleChangeComplete}" />
</WrapperField>
); }; export default
ColorEdit;