import { useState } from "react";
import type { Radius } from "../types/radius";
import { generateBorderRadius } from "../utils/css";

export default function BorderRadiusPreviewer() {
    const [radius, setRadius] = useState<Radius>({ topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 });
    const [copied, setCopied] = useState<boolean>(false);

    const handleChange = (key: keyof Radius, value: number) => {
        if (value < 0) return;
        setRadius(prev => ({ ...prev, [key]: value }));
    }

    return (
        <div className="container">
            <h1>Border Radius Previewer</h1>

            <div
                className="preview-box"
                style={{
                    borderRadius: generateBorderRadius(radius)
                }}
            >
                <div className="controls">
                    {Object.entries(radius).map(([key, value]) => (
                        <div key={key} className="control">
                            <label htmlFor={key}>{key.toUpperCase()}</label>
                            <input
                                type="range"
                                id={key}
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => handleChange(key as keyof Radius, parseInt(e.target.value))}
                            />
                            <input
                                type="number"
                                id={`${key}-number`}
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => handleChange(key as keyof Radius, parseInt(e.target.value))}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="output">
                css: <code>{generateBorderRadius(radius)}</code>
                <button onClick={() => {
                    navigator.clipboard.writeText(generateBorderRadius(radius));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}>{copied ? "Copied!" : "Copy"}</button>

            </div>
        </div>
    )


}