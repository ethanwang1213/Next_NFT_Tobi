import { useTranslations } from "next-intl";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";

export enum FilterItem {
  Price = 0,
  Status,
  CreationDate,
  FilterItemCount,
}

export enum FilterStatus {
  Draft = 0,
  Private,
  ViewOnly,
  Sale,
  Unlisted,
  FilterStatusCount,
}

const useFilterControl = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const toggleFilter = (index) => {
    const newFilters = [...filters];
    newFilters[index] = !newFilters[index];
    setFilters(newFilters);
  };

  return [filters, toggleFilter];
};

const DigitalItemFilterMenu = (props: {
  filterArray: boolean[];
  toggleFilter: (index: number) => void;
  price: { from: number; to: number };
  setPrice: (price: { from: number; to: number }) => void;
  statusArray: boolean[];
  toggleStatus: (index: number) => void;
  createDate: { from: Date; to: Date };
  setCreateDate: (date: { from: Date; to: Date }) => void;
}) => {
  const t = useTranslations("Item");
  return (
    <div className="w-80 flex flex-col items-start justify-center gap-2">
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkPrice"
            checked={props.filterArray[FilterItem.Price]}
            onChange={(e) => props.toggleFilter(FilterItem.Price)}
          />
          <label htmlFor="chkPrice" className="ml-2 text-base/8">
            {t("Price")}
          </label>
        </div>
        {props.filterArray[FilterItem.Price] ? (
          <div className="flex items-center ml-6">
            <NumericFormat
              defaultValue={props.price.from}
              prefix="￥"
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                props.setPrice({ ...props.price, from: values.floatValue })
              }
              className="w-[104px] h-8 text-xs text-right bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <NumericFormat
              defaultValue={props.price.to}
              prefix="￥"
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                props.setPrice({ ...props.price, to: values.floatValue })
              }
              className="w-[104px] h-8 text-xs text-right bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkStatus"
            checked={props.filterArray[FilterItem.Status]}
            onChange={(e) => props.toggleFilter(FilterItem.Status)}
          />
          <label htmlFor="chkStatus" className="ml-2 text-base/8">
            {t("Status")}
          </label>
        </div>
        {props.filterArray[FilterItem.Status] ? (
          <div className="flex flex-col items-start justify-center gap-2 ml-6">
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkDraft"
                checked={props.statusArray[FilterStatus.Draft]}
                onChange={(e) => props.toggleStatus(FilterStatus.Draft)}
              />
              <label htmlFor="chkDraft" className="ml-2 text-sm">
                {t("Draft")}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkPrivate"
                checked={props.statusArray[FilterStatus.Private]}
                onChange={(e) => props.toggleStatus(FilterStatus.Private)}
              />
              <label htmlFor="chkPrivate" className="ml-2 text-sm">
                {t("Private")}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkViewingOnly"
                checked={props.statusArray[FilterStatus.ViewOnly]}
                onChange={(e) => props.toggleStatus(FilterStatus.ViewOnly)}
              />
              <label htmlFor="chkViewingOnly" className="ml-2 text-sm">
                {t("ViewingOnly")}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkOnSale"
                checked={props.statusArray[FilterStatus.Sale]}
                onChange={(e) => props.toggleStatus(FilterStatus.Sale)}
              />
              <label htmlFor="chkOnSale" className="ml-2 text-sm">
                {t("OnSale")}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkUnlisted"
                checked={props.statusArray[FilterStatus.Unlisted]}
                onChange={(e) => props.toggleStatus(FilterStatus.Unlisted)}
              />
              <label htmlFor="chkUnlisted" className="ml-2 text-sm">
                {t("Unlisted")}
              </label>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkCreationDate"
            checked={props.filterArray[FilterItem.CreationDate]}
            onChange={(e) => props.toggleFilter(FilterItem.CreationDate)}
          />
          <label htmlFor="chkCreationDate" className="ml-2 text-base/8">
            {t("CreationDate")}
          </label>
        </div>
        {props.filterArray[FilterItem.CreationDate] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={props.createDate.from}
              onChange={(date) =>
                props.setCreateDate({ ...props.createDate, from: date })
              }
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={props.createDate.to}
              onChange={(date) =>
                props.setCreateDate({ ...props.createDate, to: date })
              }
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DigitalItemFilterMenu;
