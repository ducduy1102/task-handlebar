import { WrapperField } from '@/components/builders/elements'; const
TextTable
= ({ id, schema, required, onChange, value, props }) => { console.log('🚀 ~
TextTable
~ value:', value); return (
<WrapperField
  title="{schema?.title}"
  description="{schema?.description}"
  required="{required}"
>
  <div
    className="w-4 h-4 rounded-full"
    style="background-color: transparent"
  ></div>
</WrapperField>
); }; export default
TextTable;