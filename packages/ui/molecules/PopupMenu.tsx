import { FILTER_TYPE, FILTER } from "ui/atoms/PopupMenuChildType";

export default function PopupMenu({ filters, preference, changeHandler }) {
  let offsetIndex: Number[] = [];
  let parentOffsetIndex: Number[] = [];

  const fnRenderFilterControl = (filter: FILTER, index: number) => {
    const type = filter.type === FILTER_TYPE.CHECKBOX ? "checkbox" : "radio";

    offsetIndex[type] = (offsetIndex[type] ?? 0) + 1;

    const absIndex = index + offsetIndex[type];
    const controlKey = `${type}${absIndex}`;

    filter.children && parentOffsetIndex.push(absIndex);

    const props = {
      id: controlKey,
      type: type,
      label: filter.label,
      checked: preference[controlKey],
      name:
        filter.type === FILTER_TYPE.RADIO
          ? `group${
              parentOffsetIndex.length &&
              parentOffsetIndex[parentOffsetIndex.length - 1]
            }`
          : undefined,
      onChange: () => changeHandler(controlKey),
    };

    const result = (
      <div key={props.id}>
        <div
          className={`px-4${filter.type === FILTER_TYPE.RADIO ? " pl-9" : ""}`}
        >
          <input {...props} />
          <label htmlFor={props.id} className="ml-2 text-base/8">
            {filter.label}
          </label>
        </div>
        {filter.children && filter.children.map(fnRenderFilterControl)}
      </div>
    );

    filter.children && parentOffsetIndex.pop();

    return result;
  };

  return filters.map(fnRenderFilterControl);
}
