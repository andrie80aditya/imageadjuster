import React, { useState, useEffect, useRef } from 'react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Upload, Sun, Download, Contrast, Filter } from 'lucide-react';

const ImageAdjuster = () => {
    const [image, setImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [filter, setFilter] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (image) {
            adjustImage();
        }
    }, [image, brightness, contrast, filter]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const adjustImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx || !image) return;

        const img = new Image();
        img.onload = () => {
            const maxWidth = Math.min(400, window.innerWidth - 40);
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                // Apply brightness
                let r = data[i] * brightness / 100;
                let g = data[i + 1] * brightness / 100;
                let b = data[i + 2] * brightness / 100;

                // Apply contrast
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                r = factor * (r - 128) + 128;
                g = factor * (g - 128) + 128;
                b = factor * (b - 128) + 128;

                // Apply grayscale filter
                const gray = (r + g + b) / 3;
                r = r * (1 - filter / 100) + gray * (filter / 100);
                g = g * (1 - filter / 100) + gray * (filter / 100);
                b = b * (1 - filter / 100) + gray * (filter / 100);

                // Clamp values
                data[i] = Math.max(0, Math.min(255, r));
                data[i + 1] = Math.max(0, Math.min(255, g));
                data[i + 2] = Math.max(0, Math.min(255, b));
            }

            ctx.putImageData(imageData, 0, 0);
        };
        img.src = image;
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'adjusted-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-2xl">Image Adjuster</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageInput"
                    />
                    <Button variant="outline" className="w-full" onClick={handleUploadClick}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                </div>
                {image && (
                    <>
                        <div className="mb-4 flex justify-center">
                            <canvas ref={canvasRef} className="max-w-full h-auto border border-gray-300" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Sun className="h-6 w-6 text-yellow-500" />
                                <Slider
                                    value={[brightness]}
                                    onValueChange={(values) => setBrightness(values[0])}
                                    min={0}
                                    max={200}
                                    step={1}
                                    className="flex-grow"
                                />
                                <span className="text-sm font-medium w-12 text-right">{brightness}%</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Contrast className="h-6 w-6 text-blue-500" />
                                <Slider
                                    value={[contrast]}
                                    onValueChange={(values) => setContrast(values[0])}
                                    min={0}
                                    max={200}
                                    step={1}
                                    className="flex-grow"
                                />
                                <span className="text-sm font-medium w-12 text-right">{contrast}%</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Filter className="h-6 w-6 text-green-500" />
                                <Slider
                                    value={[filter]}
                                    onValueChange={(values) => setFilter(values[0])}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="flex-grow"
                                />
                                <span className="text-sm font-medium w-12 text-right">{filter}%</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" /> Download Adjusted Image
                        </Button>
                    </>
                )}
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-500">
                Adjust sliders to change image properties
            </CardFooter>
        </Card>
    );
};

export default ImageAdjuster;