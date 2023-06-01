// 以下のtypescript周りのエラーについて、
// 解決策が現状わからないのでjsファイルにしている
//
// react-springで、animatedのコンポーネントを生成すると、
// プロパティの型が増大して、
// "Type instantiation is excessively deep and possibly infinite"
// というエラーが発生する

import { a } from "@react-spring/three";

// type Props = {
//   intensity: number;
//   width: number;
//   height: number;
// };
const ARectAreaLight = (props) => (
  <a.rectAreaLight {...props} position={[0, 0, -10]} />
);

export default ARectAreaLight;
