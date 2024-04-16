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

const SampleFilterMenu = () => {
  const [filterArray, toggleFilter] = useFilterControl([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [price, setPrice] = useState({ from: 0, to: 0 });
  const [statusArray, toggleStatus] = useFilterControl([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [saleStartDate, setSaleStartDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [saleEndDate, setSaleEndDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [soldCount, setSoldCount] = useState({ from: 0, to: 0 });
  const [createDate, setCreateDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="w-80 flex flex-col items-start justify-center gap-2">
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkPrice"
            checked={filterArray[0]}
            onChange={(e) => toggleFilter(0)}
          />
          <label htmlFor="chkPrice" className="ml-2 text-base/8">
            Price
          </label>
        </div>
        {filterArray[0] ? (
          <div className="flex items-center ml-6">
            <NumericFormat
              defaultValue={price.from}
              prefix="￥"
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setPrice({ ...price, from: values.floatValue })
              }
              className="w-[104px] h-8 text-xs text-right bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <NumericFormat
              defaultValue={price.to}
              prefix="￥"
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setPrice({ ...price, to: values.floatValue })
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
            checked={filterArray[1]}
            onChange={(e) => toggleFilter(1)}
          />
          <label htmlFor="chkStatus" className="ml-2 text-base/8">
            Status
          </label>
        </div>
        {filterArray[1] ? (
          <div className="flex flex-col items-start justify-center gap-2 ml-6">
            <div>
              <input
                type="checkbox"
                className="tobiratory-checkbox w-3 h-3"
                id="chkDraft"
                checked={statusArray[0]}
                onChange={(e) => toggleStatus(0)}
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
                checked={statusArray[1]}
                onChange={(e) => toggleStatus(1)}
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
                checked={statusArray[2]}
                onChange={(e) => toggleStatus(2)}
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
                checked={statusArray[3]}
                onChange={(e) => toggleStatus(3)}
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
                checked={statusArray[4]}
                onChange={(e) => toggleStatus(4)}
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
                checked={statusArray[5]}
                onChange={(e) => toggleStatus(5)}
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
                checked={statusArray[6]}
                onChange={(e) => toggleStatus(6)}
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
            checked={filterArray[2]}
            onChange={(e) => toggleFilter(2)}
          />
          <label htmlFor="chkSaleStartDate" className="ml-2 text-base/8">
            Sale Start Date
          </label>
        </div>
        {filterArray[2] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={saleStartDate.from}
              onChange={(date) =>
                setSaleStartDate({ ...saleStartDate, from: date })
              }
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={saleStartDate.to}
              onChange={(date) =>
                setSaleStartDate({ ...saleStartDate, to: date })
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
            checked={filterArray[3]}
            onChange={(e) => toggleFilter(3)}
          />
          <label htmlFor="chkSaleEndDate" className="ml-2 text-base/8">
            Sale End Date
          </label>
        </div>
        {filterArray[3] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={saleEndDate.from}
              onChange={(date) =>
                setSaleEndDate({ ...saleEndDate, from: date })
              }
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={saleEndDate.to}
              onChange={(date) => setSaleEndDate({ ...saleEndDate, to: date })}
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
            id="chkUnitsSold"
            checked={filterArray[4]}
            onChange={(e) => toggleFilter(4)}
          />
          <label htmlFor="chkUnitsSold" className="ml-2 text-base/8">
            Units Sold
          </label>
        </div>
        {filterArray[4] ? (
          <div className="flex items-center ml-6">
            <NumericFormat
              defaultValue={soldCount.from}
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setSoldCount({ ...soldCount, from: values.floatValue })
              }
              className="w-[60px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <NumericFormat
              defaultValue={soldCount.to}
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setSoldCount({ ...soldCount, to: values.floatValue })
              }
              className="w-[60px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
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
            checked={filterArray[5]}
            onChange={(e) => toggleFilter(5)}
          />
          <label htmlFor="chkCreationDate" className="ml-2 text-base/8">
            Creation Date
          </label>
        </div>
        {filterArray[5] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={createDate.from}
              onChange={(date) => setCreateDate({ ...createDate, from: date })}
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={createDate.to}
              onChange={(date) => setCreateDate({ ...createDate, to: date })}
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
