import { useEffect, useState, useRef } from "react";
import type { MouseEvent } from "react";
import type { Radius } from "../types/radius";
import { generateBorderRadius } from "../utils/css";
import DiceIcon from "../assets/icons/dice.svg";
import ResetIcon from "../assets/icons/reset.svg";

export default function BorderRadiusPreviewer() {
    const [radius, setRadius] = useState<Radius>({
        topLeft: 20,
        topRight: 20,
        bottomLeft: 20,
        bottomRight: 20,
        topLeftY: 20,
        topRightY: 20,
        bottomLeftY: 20,
        bottomRightY: 20,
    });
    const [copied, setCopied] = useState<boolean>(false);
    const [isEllipse, setIsEllipse] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const newRadius: Partial<Radius> = {};
        if (params.size > 0) {
            params.forEach((value, key) => {
                newRadius[key as keyof Radius] = parseInt(value);
            });
            setRadius(newRadius as Radius);
        }

        if (params.has("ellipse")) {
            setIsEllipse(params.get("ellipse") === "true");
        }

        if (!params.has("topLeft") || !params.has("topRight") || !params.has("bottomLeft") || !params.has("bottomRight")) {
            setRadius({
                topLeft: 20,
                topRight: 20,
                bottomLeft: 20,
                bottomRight: 20,
                topLeftY: 20,
                topRightY: 20,
                bottomLeftY: 20,
                bottomRightY: 20,
            });
        }

    }, []);

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
        "Default": { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 },
    };

    const ellipsePresets: Record<string, Radius> = {
        "rounded": { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20, topLeftY: 20, topRightY: 20, bottomLeftY: 20, bottomRightY: 20 },
        "pill": { topLeft: 999, topRight: 999, bottomLeft: 999, bottomRight: 999, topLeftY: 999, topRightY: 999, bottomLeftY: 999, bottomRightY: 999 },
        "square": { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0, topLeftY: 0, topRightY: 0, bottomLeftY: 0, bottomRightY: 0 },
        "Default": { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20, topLeftY: 20, topRightY: 20, bottomLeftY: 20, bottomRightY: 20 },
    };

    const handleChange = (key: keyof Radius, value: number) => {
        if (value < 0) return;
        setRadius(prev => ({ ...prev, [key]: value }));
    }

    const randomizeRadius = () => {
        // Generate random values for each key
        const newRadius: Radius = {
            topLeft: Math.floor(Math.random() * 101),
            topRight: Math.floor(Math.random() * 101),
            bottomLeft: Math.floor(Math.random() * 101),
            bottomRight: Math.floor(Math.random() * 101),
        };
        if (isEllipse) {
            newRadius.topLeftY = Math.floor(Math.random() * 101);
            newRadius.topRightY = Math.floor(Math.random() * 101);
            newRadius.bottomLeftY = Math.floor(Math.random() * 101);
            newRadius.bottomRightY = Math.floor(Math.random() * 101);
        }
        setRadius(newRadius);
    }

    const resetRadius = () => {
        setRadius({
            topLeft: 20,
            topRight: 20,
            bottomLeft: 20,
            bottomRight: 20,
            topLeftY: 20,
            topRightY: 20,
            bottomLeftY: 20,
            bottomRightY: 20,
        });
    };

    const handleMouseDown = (corner: string) => (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(corner);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !previewRef.current) return;

        const rect = previewRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const deltaX = Math.abs(mouseX - centerX);
        const deltaY = Math.abs(mouseY - centerY);

        const maxRadius = Math.min(rect.width, rect.height) / 2;
        const radiusX = Math.min(Math.max(0, deltaX), maxRadius);
        const radiusY = Math.min(Math.max(0, deltaY), maxRadius);

        const scaledRadiusX = Math.round((radiusX / maxRadius) * 100);
        const scaledRadiusY = Math.round((radiusY / maxRadius) * 100);

        const newRadius = { ...radius };

        switch (isDragging) {
            case 'topLeft':
                newRadius.topLeft = scaledRadiusX;
                if (isEllipse) newRadius.topLeftY = scaledRadiusY;
                break;
            case 'topRight':
                newRadius.topRight = scaledRadiusX;
                if (isEllipse) newRadius.topRightY = scaledRadiusY;
                break;
            case 'bottomLeft':
                newRadius.bottomLeft = scaledRadiusX;
                if (isEllipse) newRadius.bottomLeftY = scaledRadiusY;
                break;
            case 'bottomRight':
                newRadius.bottomRight = scaledRadiusX;
                if (isEllipse) newRadius.bottomRightY = scaledRadiusY;
                break;
        }

        setRadius(newRadius);
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove as any);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove as any);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, radius, isEllipse]);

    return (
        <div className="container">
            <div className="utility">
                {/* Randomize button and reset button with icons */}
                <button onClick={randomizeRadius} className="btn btn-green">
                    {/* DiceIcon SVG should be visible */}
                    <img src={DiceIcon} alt="Randomize" />
                    Randomize
                </button>
                <button onClick={resetRadius} className="btn btn-red">
                    <img src={ResetIcon} alt="Reset" />
                    Reset
                </button>
                {/* Toggle for elliptical mode */}
                <div className="toggle">
                    <label htmlFor="ellipse">Elliptical Mode (8 values)</label>
                    <input
                        type="checkbox"
                        id="ellipse"
                        checked={isEllipse}
                        onChange={(e) => {
                            setIsEllipse(e.target.checked);
                            // Reset to default values when switching modes
                            if (e.target.checked) {
                                setRadius(ellipsePresets['Default']);
                            } else {
                                setRadius(presets['Default']);
                            }
                        }}
                    />
                </div>
                {/* Presets */}
                <div className="presets">
                    {Object.keys(presets).filter((preset) => preset !== 'Default').map((preset) => (
                        <button key={preset} onClick={() => setRadius(isEllipse ? ellipsePresets[preset] : presets[preset])}>{preset}</button>
                    ))}
                </div>
            </div>
            <div className="preview-container">
                <div
                    ref={previewRef}
                    className="preview-box"
                    style={{
                        borderRadius: generateBorderRadius(radius, isEllipse)
                    }}
                >
                    {/* Draggable handles */}
                    <div
                        className="drag-handle top-left"
                        onMouseDown={handleMouseDown('topLeft')}
                        style={{ cursor: isDragging === 'topLeft' ? 'grabbing' : 'grab' }}
                    />
                    <div
                        className="drag-handle top-right"
                        onMouseDown={handleMouseDown('topRight')}
                        style={{ cursor: isDragging === 'topRight' ? 'grabbing' : 'grab' }}
                    />
                    <div
                        className="drag-handle bottom-left"
                        onMouseDown={handleMouseDown('bottomLeft')}
                        style={{ cursor: isDragging === 'bottomLeft' ? 'grabbing' : 'grab' }}
                    />
                    <div
                        className="drag-handle bottom-right"
                        onMouseDown={handleMouseDown('bottomRight')}
                        style={{ cursor: isDragging === 'bottomRight' ? 'grabbing' : 'grab' }}
                    />
                </div>
            </div>
            <div className="controls">
                {activeKeys.map((key) => (
                    <div key={key} className="control">
                        <div className="flex-row">
                            {/* Simple CSS-based indicator */}
                            <div
                                className="indicator"
                                style={{
                                    // Apply the radius to only the specific corner being controlled
                                    borderTopLeftRadius: key.includes('topLeft') ? '4px' : '0',
                                    borderTopRightRadius: key.includes('topRight') ? '4px' : '0',
                                    borderBottomLeftRadius: key.includes('bottomLeft') ? '4px' : '0',
                                    borderBottomRightRadius: key.includes('bottomRight') ? '4px' : '0',
                                }}
                            />
                            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        </div>
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
                <span>css:</span> <code>{generateBorderRadius(radius, isEllipse)}</code>
                <button onClick={() => {
                    navigator.clipboard.writeText(`border-radius: ${generateBorderRadius(radius, isEllipse)};`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}>{copied ? "Copied!" : "Copy"}</button>

            </div>
        </div>
    )
}