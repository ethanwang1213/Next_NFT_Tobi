declare module "*.png" {
  import { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.webp" {
  import { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.glb" {
  const src: string;
  export default src;
}

export type ServiceName = "web" | "journal";
