import ColorDefault from './ColorDefault'; import ColorSetting from
'./ColorSetting'; const setting = { color: { displayName: 'Color editor',
matchIf: [ { types: ['string'], widget: 'color', }, ], defaultDataSchema: {
type: 'string', widget: 'color', }, defaultUiSchema: { 'ui:widget': 'color', },
type: 'object', cardBody:
ColorDefault, modalBody:
ColorSetting, }, }; export default setting;