import TypeValueLine from "../../../TypeValueLine";

const ReceiverData: React.FC = () => {
  return (
    <div className="grid gap-4">
      <TypeValueLine
        lineType={"Receive Account"}
        lineValue={"KEISUKE"}
        styleMode={"REDEEM_DATA"}
      />
      <TypeValueLine
        lineType={"Receive Journal ID"}
        lineValue={"KEISUKE"}
        styleMode={"REDEEM_DATA"}
        hidable={true}
      />
    </div>
  );
};

export default ReceiverData;
