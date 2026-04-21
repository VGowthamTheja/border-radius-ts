import { useEffect, useState } from "react";
import type { Radius } from "../types/radius";
import { generateBorderRadius } from "../utils/css";

export default function BorderRadiusPreviewer() {
    const [radius, setRadius] = useState<Radius>(
        {
            topLeft: 20,
            topRight: 20,
            bottomLeft: 20,
            bottomRight: 20,
            topLeftY: 20,
            topRightY: 20,
            bottomLeftY: 20,
            bottomRightY: 20,
        }
    );
    const [copied, setCopied] = useState<boolean>(false);
    const [isEllipse, setIsEllipse] = useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const newRadius: Partial<Radius> = {};

        params.forEach((value, key) => {
            newRadius[key as keyof Radius] = parseInt(value);
        });
        if (Object.keys(newRadius).length > 0) {
            setRadius((prev) => ({ ...prev, ...newRadius }));
        }
    }, [])
    useEffect(() => {
        // Update URL with current radius values
        const params = new URLSearchParams();
        Object.entries(radius).forEach(([key, value]) => {
            params.set(key, value.toString());
        });
        window.history.replaceState({}, "", `?${params.toString()}`);
    }, [radius]);

    const keys4: (keyof Radius)[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
    const keys8: (keyof Radius)[] = ["topLeft", "topRight", "bottomLeft", "bottomRight", "topLeftY", "topRightY", "bottomLeftY", "bottomRightY"];
    const activeKeys = isEllipse ? keys8 : keys4;

    const presets: Record<string, Radius> = {
        "rounded": { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 },
        "pill": { topLeft: 999, topRight: 999, bottomLeft: 999, bottomRight: 999 },
        "square": { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
    };

    const handleChange = (key: keyof Radius, value: number) => {
        if (value < 0) return;
        setRadius(prev => ({ ...prev, [key]: value }));
    }

    const randomizeRadius = () => {
        setRadius({
            topLeft: Math.floor(Math.random() * 101),
            topRight: Math.floor(Math.random() * 101),
            bottomLeft: Math.floor(Math.random() * 101),
            bottomRight: Math.floor(Math.random() * 101),
        });
    }

    const resetRadius = () => {
        setRadius({ topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 });
    };

    return (
        <div className="container">
            <div className="utility">
                {/* Randomize button and reset button with icons */}
                <button onClick={randomizeRadius}>Randomize</button>
                <button onClick={resetRadius}>Reset</button>
                {/* Toggle for elliptical mode */}
                <div className="toggle">
                    <label htmlFor="ellipse">Elliptical Mode (8 values)</label>
                    <input
                        type="checkbox"
                        id="ellipse"
                        checked={isEllipse}
                        onChange={(e) => setIsEllipse(e.target.checked)}
                    />
                </div>
                {/* Presets */}
                <div className="presets">
                    {Object.keys(presets).map((preset) => (
                        <button key={preset} onClick={() => setRadius(presets[preset])}>{preset}</button>
                    ))}
                </div>
            </div>
            <div
                className="preview-box"
                style={{
                    borderRadius: generateBorderRadius(radius, isEllipse)
                }}
            >
            </div>
            <div className="controls">
                {activeKeys.map((key) => (
                    <div key={key} className="control">
                        <label htmlFor={key}>{key.toUpperCase()}</label>
                        <input
                            type="range"
                            id={key}
                            min="0"
                            max="100"
                            value={radius[key] ?? 0}
                            onChange={(e) => handleChange(key as keyof Radius, parseInt(e.target.value))}
                        />
                        <input
                            type="number"
                            id={`${key}-number`}
                            min="0"
                            max="100"
                            value={radius[key] ?? 0}
                            onChange={(e) => handleChange(key as keyof Radius, parseInt(e.target.value))}
                        />
                    </div>
                ))}
            </div>
            <div className="output">
                css: <code>{generateBorderRadius(radius, isEllipse)}</code>
                <button onClick={() => {
                    navigator.clipboard.writeText(`border-radius: ${generateBorderRadius(radius, isEllipse)};`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}>{copied ? "Copied!" : "Copy"}</button>

            </div>
        </div>
    )
}