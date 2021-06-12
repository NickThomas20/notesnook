import { hexToRGB } from "../../utils/color";
import StaticColorSchemeFactory from "./static";

class DarkColorSchemeFactory {
  constructor(accent) {
    return {
      primary: accent,
      placeholder: hexToRGB("#ffffff", 0.6),
      background: "#1f1f1f",
      accent: "#000",
      bgSecondary: "#2b2b2b",
      border: "#2b2b2b",
      hover: "#3b3b3b",
      fontSecondary: "#000",
      fontTertiary: "#7b7b7b",
      text: "#d3d3d3",
      overlay: "rgba(255, 255, 255, 0.5)",
      secondary: "black",
      icon: "#dbdbdb",
      disabled: "#5b5b5b",
      ...new StaticColorSchemeFactory(accent),
    };
  }
}
export default DarkColorSchemeFactory;