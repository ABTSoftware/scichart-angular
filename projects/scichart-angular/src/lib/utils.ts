import { generateGuid } from "scichart";

export const createChartRoot = () => {
    // check if SSR
    if (typeof window === "undefined") {
        return null;
    }

    const internalRootElement = document.createElement("div") as HTMLDivElement;
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = "100%";
    internalRootElement.style.height = "100%";
    return internalRootElement;
};
