// 以下のtypescript周りのエラーについて、
// 解決策が現状わからないのでjsファイルにしている
//
// react-springで、animatedのコンポーネントを生成すると、
// プロパティの型が増大して、
// "Type instantiation is excessively deep and possibly infinite"
// というエラーが発生する

import { a } from "@react-spring/three";

// type Props = {
//     intencity: number;
// }
const AAmbientLight = (props) => <a.ambientLight {...props} />;

export default AAmbientLight;
