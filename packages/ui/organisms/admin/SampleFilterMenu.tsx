import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";

const SampleFilterMenu = () => {
  const [filterArray, setFilterArray] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);

  const [statusArray, setStatusArray] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [saleStartDateFrom, setSaleStartDateFrom] = useState(new Date());
  const [saleStartDateTo, setSaleStartDateTo] = useState(new Date());

  const [saleEndDateFrom, setSaleEndDateFrom] = useState(new Date());
  const [saleEndDateTo, setSaleEndDateTo] = useState(new Date());

  const [soldFrom, setSoldFrom] = useState(0);
  const [soldTo, setSoldTo] = useState(0);

  const [createDateFrom, setCreateDateFrom] = useState(new Date());
  const [createDateTo, setCreateDateTo] = useState(new Date());

  return (
    <div className="w-80 flex flex-col items-start justify-center gap-2">
      <div className="flex flex-col items-start justify-center gap-1">
        <div className="flex items-center h-8">
          <input
            type="checkbox"
            className="tobiratory-checkbox w-3 h-3"
            id="chkPrice"
            defaultChecked={filterArray[0]}
            onChange={(e) =>
              setFilterArray({ ...filterArray, [0]: e.target.checked })
            }
          />
          <label htmlFor="chkPrice" className="ml-2 text-base/8">
            Price
          </label>
        </div>
        {filterArray[0] ? (
          <div className="flex items-center ml-6">
            <NumericFormat
              defaultValue={priceFrom}
              prefix="￥"
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setPriceFrom(values.floatValue)
              }
              className="w-[104px] h-8 text-xs text-right bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <NumericFormat
              defaultValue={priceTo}
              prefix="￥"
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setPriceTo(values.floatValue)
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
            defaultChecked={filterArray[1]}
            onChange={(e) =>
              setFilterArray({ ...filterArray, [1]: e.target.checked })
            }
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
                defaultChecked={statusArray[0]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [0]: e.target.checked })
                }
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
                defaultChecked={statusArray[1]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [1]: e.target.checked })
                }
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
                defaultChecked={statusArray[2]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [2]: e.target.checked })
                }
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
                defaultChecked={statusArray[3]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [3]: e.target.checked })
                }
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
                defaultChecked={statusArray[4]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [4]: e.target.checked })
                }
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
                defaultChecked={statusArray[5]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [5]: e.target.checked })
                }
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
                defaultChecked={statusArray[6]}
                onChange={(e) =>
                  setStatusArray({ ...statusArray, [6]: e.target.checked })
                }
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
            defaultChecked={filterArray[2]}
            onChange={(e) =>
              setFilterArray({ ...filterArray, [2]: e.target.checked })
            }
          />
          <label htmlFor="chkSaleStartDate" className="ml-2 text-base/8">
            Sale Start Date
          </label>
        </div>
        {filterArray[2] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={saleStartDateFrom}
              onChange={(date) => setSaleStartDateFrom(date)}
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={saleStartDateTo}
              onChange={(date) => setSaleStartDateTo(date)}
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
            defaultChecked={filterArray[3]}
            onChange={(e) =>
              setFilterArray({ ...filterArray, [3]: e.target.checked })
            }
          />
          <label htmlFor="chkSaleEndDate" className="ml-2 text-base/8">
            Sale End Date
          </label>
        </div>
        {filterArray[3] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={saleEndDateFrom}
              onChange={(date) => setSaleEndDateFrom(date)}
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={saleEndDateTo}
              onChange={(date) => setSaleEndDateTo(date)}
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
            defaultChecked={filterArray[4]}
            onChange={(e) =>
              setFilterArray({ ...filterArray, [4]: e.target.checked })
            }
          />
          <label htmlFor="chkUnitsSold" className="ml-2 text-base/8">
            Units Sold
          </label>
        </div>
        {filterArray[4] ? (
          <div className="flex items-center ml-6">
            <NumericFormat
              defaultValue={soldFrom}
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setSoldFrom(values.floatValue)
              }
              className="w-[60px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <NumericFormat
              defaultValue={soldTo}
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              onValueChange={(values, sourceInfo) =>
                setSoldTo(values.floatValue)
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
            defaultChecked={filterArray[5]}
            onChange={(e) =>
              setFilterArray({ ...filterArray, [5]: e.target.checked })
            }
          />
          <label htmlFor="chkCreationDate" className="ml-2 text-base/8">
            Creation Date
          </label>
        </div>
        {filterArray[5] ? (
          <div className="flex items-center ml-6">
            <DatePicker
              selected={createDateFrom}
              onChange={(date) => setCreateDateFrom(date)}
              dateFormat="yyyy/MM/dd"
              showPopperArrow={false}
              className="w-[104px] h-8 text-xs text-center bg-[#093159] border border-white rounded-[3px] px-3 py-1 inline-block outline-none"
            />
            <span className="w-10 text-center">~</span>
            <DatePicker
              selected={createDateTo}
              onChange={(date) => setCreateDateTo(date)}
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
