import { FC } from "react";

const TestPage: FC<{ color: string }> = ({ color }) => {
  return (
    <p
      className="text-2xl w-full h-full text-white p-3"
      style={{ backgroundColor: color }}
    >
      test page
    </p>
  );
};

export default TestPage;
