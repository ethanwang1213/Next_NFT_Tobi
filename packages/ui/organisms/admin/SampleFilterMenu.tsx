import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";

const useFilterControl = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const toggleFilter = (index) => {
    const newFilters = [...filters];
    newFilters[index] = !newFilters[index];
    setFilters(newFilters);
  };

  return [filters, toggleFilter];
};

const SampleFilterMenu = (props) => {
  return (
    <div className="w-80 flex flex-col items-start justify-center gap-2">
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkPrice"
            checked={props.filterArray[0]}
            onChange={(e) => props.toggleFilter(0)}
          />
          <label htmlFor="chkPrice" className="ml-2 text-base/8">
            Price
          </label>
        </div>
        {props.filterArray[0] ? (
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
            checked={props.filterArray[1]}
            onChange={(e) => props.toggleFilter(1)}
          />
          <label htmlFor="chkStatus" className="ml-2 text-base/8">
            Status
          </label>
        </div>
        {props.filterArray[1] ? (
          <div className="flex flex-col items-start justify-center gap-2 ml-6">
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkDraft"
                checked={props.statusArray[0]}
                onChange={(e) => props.toggleStatus(0)}
              />
              <label htmlFor="chkDraft" className="ml-2 text-sm">
                Draft
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkPrivate"
                checked={props.statusArray[1]}
                onChange={(e) => props.toggleStatus(1)}
              />
              <label htmlFor="chkPrivate" className="ml-2 text-sm">
                Private
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkViewingOnly"
                checked={props.statusArray[2]}
                onChange={(e) => props.toggleStatus(2)}
              />
              <label htmlFor="chkViewingOnly" className="ml-2 text-sm">
                Viewing Only
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkOnSale"
                checked={props.statusArray[3]}
                onChange={(e) => props.toggleStatus(3)}
              />
              <label htmlFor="chkOnSale" className="ml-2 text-sm">
                On Sale
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkUnlisted"
                checked={props.statusArray[4]}
                onChange={(e) => props.toggleStatus(4)}
              />
              <label htmlFor="chkUnlisted" className="ml-2 text-sm">
                Unlisted
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkScheduledPublishing"
                checked={props.statusArray[5]}
                onChange={(e) => props.toggleStatus(5)}
              />
              <label htmlFor="chkScheduledPublishing" className="ml-2 text-sm">
                Scheduled Publishing
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkScheduledSale"
                checked={props.statusArray[6]}
                onChange={(e) => props.toggleStatus(6)}
              />
              <label htmlFor="chkScheduledSale" className="ml-2 text-sm">
                Scheduled for Sale
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
            id="chkSaleStartDate"
            checked={props.filterArray[2]}
            onChange={(e) => props.toggleFilter(2)}
          />
          <label htmlFor="chkSaleStartDate" className="ml-2 text-base/8">
            Sale Start Date
          </label>
        </div>
        {props.filterArray[2] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={props.saleStartDate.from}
              onChange={(date) =>
                props.setSaleStartDate({ ...props.saleStartDate, from: date })
              }
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={props.saleStartDate.to}
              onChange={(date) =>
                props.setSaleStartDate({ ...props.saleStartDate, to: date })
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
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkSaleEndDate"
            checked={props.filterArray[3]}
            onChange={(e) => props.toggleFilter(3)}
          />
          <label htmlFor="chkSaleEndDate" className="ml-2 text-base/8">
            Sale End Date
          </label>
        </div>
        {props.filterArray[3] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={props.saleEndDate.from}
              onChange={(date) =>
                props.setSaleEndDate({ ...props.saleEndDate, from: date })
              }
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={props.saleEndDate.to}
              onChange={(date) =>
                props.setSaleEndDate({ ...props.saleEndDate, to: date })
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
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkCreationDate"
            checked={props.filterArray[4]}
            onChange={(e) => props.toggleFilter(4)}
          />
          <label htmlFor="chkCreationDate" className="ml-2 text-base/8">
            Creation Date
          </label>
        </div>
        {props.filterArray[4] ? (
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

export default SampleFilterMenu;
