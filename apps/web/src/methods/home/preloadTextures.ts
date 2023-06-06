
import { useTexture } from "@react-three/drei";
import homeTexture from "@/data/homeTexture.json";

const preloadTextures = (isWideMode: boolean) => {
    Object.entries(homeTexture).map((entry) => {
        const phaseName = entry[0];
        const device = !isWideMode && (phaseName === "top0" || phaseName === "top1")
            ? 'sp' : 'pc';
        entry[1].map(fileName => {
            useTexture.preload(
                `/home/${phaseName}/${device}/${fileName}`);
        });
    });
    // homeModel.map(v => {
    //     useLoader.preload(OBJLoader, v);
    // });
};

export default preloadTextures;