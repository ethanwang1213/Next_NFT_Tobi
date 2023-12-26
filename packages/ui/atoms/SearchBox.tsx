import SearchIcon from "ui/atoms/SearchIcon";

type Props = {
  placeholder: string;
  textFieldClassName?: string;
  iconClassName?: string;
};

// TODO: 検索処理をするコールバックを受け取るようにする
const SearchBox = ({
  textFieldClassName,
  iconClassName,
  placeholder,
}: Props) => {
  return (
    <div className="form-control">
      <div className="relative">
        <div className={iconClassName}>
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className={textFieldClassName}
        />
      </div>
    </div>
  );
};

export default SearchBox;
