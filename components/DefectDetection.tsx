"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, AlertCircle, CheckCircle, ImageIcon, RotateCw } from "lucide-react"
import Image from "next/image"

interface DefectResult {
  hasDefect: boolean
  confidence: number
  defectType?: string
  defectLocation?: { x: number; y: number; width: number; height: number }
}

export function DefectDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [result, setResult] = useState<DefectResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setAnalysisComplete(false)
    setResult(null)

    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setSelectedFile(file)
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)
  }

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError("Please select an image first")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // In a real implementation, you would upload the file to your server
      // and call your Python model API
      const formData = new FormData()
      formData.append("image", selectedFile)

      // Simulate API call with a timeout
      // Replace this with your actual API call to your Python model
      setTimeout(() => {
        // This is mock data - in a real implementation, this would come from your Python model
        const mockResult: DefectResult = {
          hasDefect: Math.random() > 0.5, // Randomly determine if there's a defect for demo
          confidence: Math.round(Math.random() * 100),
          defectType: "Fabric tear",
          defectLocation: { x: 120, y: 80, width: 60, height: 40 },
        }

        setResult(mockResult)
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 2000)

      // Real implementation would look like this:
      /*
      const response = await fetch('/api/analyze-defect', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setResult(data)
      */
    } catch (err) {
      setError("Failed to analyze image. Please try again.")
      console.error("Error analyzing image:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setAnalysisComplete(false)
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 w-full h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                      </>
                    )}
                  </div>

                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                  <div className="flex space-x-2 w-full">
                    <Button onClick={analyzeImage} className="flex-1" disabled={!selectedFile || isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze for Defects"
                      )}
                    </Button>

                    <Button variant="outline" onClick={resetAnalysis} disabled={isAnalyzing}>
                      Reset
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-4">Analysis Results</h3>

                  {isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <Progress value={45} className="w-full" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing image for defects...</p>
                    </div>
                  )}

                  {!isAnalyzing && !analysisComplete && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-center">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Upload an image and click "Analyze for Defects" to start
                      </p>
                    </div>
                  )}

                  {analysisComplete && result && (
                    <div className="flex-1 flex flex-col space-y-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant={result.hasDefect ? "destructive" : "default"} className="px-3 py-1">
                          {result.hasDefect ? "Defect Detected" : "No Defect Found"}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Confidence: {result.confidence}%
                        </span>
                      </div>

                      {result.hasDefect && (
                        <>
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                            <p className="font-medium">Defect Details:</p>
                            <p className="text-sm mt-1">Type: {result.defectType}</p>
                            <p className="text-sm mt-1">
                              Location: (x: {result.defectLocation?.x}, y: {result.defectLocation?.y})
                            </p>
                            <p className="text-sm mt-1">
                              Size: {result.defectLocation?.width}x{result.defectLocation?.height}px
                            </p>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Recommendation: This item should be inspected manually before shipping.
                            </p>
                          </div>
                        </>
                      )}

                      {!result.hasDefect && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>This item passes quality control and is ready for shipping.</span>
                        </div>
                      )}

                      <div className="mt-auto pt-4">
                        <Button variant="outline" onClick={resetAnalysis} className="w-full">
                          Analyze Another Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <h3 className="text-lg font-medium mb-2">Analysis History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  View your previous defect detection analyses
                </p>
                <Button variant="outline">Connect to History API</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <h3 className="font-medium flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
          About Defect Detection
        </h3>
        <p className="text-sm mt-2">
          This tool uses a machine learning model to detect defects in fabric images. Upload clear, well-lit images of
          fabric for the best results. The model can detect common defects such as tears, stains, and irregular
          patterns.
        </p>
        <p className="text-sm mt-2">
          For production environments, we recommend using images with at least 1080p resolution and ensuring proper
          lighting conditions.
        </p>
      </div>
    </div>
  )
}

