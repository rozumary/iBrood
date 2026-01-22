"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Folder, File, Image as ImageIcon, FileText, ChevronLeft, Download, X, Eye } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

interface FileSystemEntry {
  name: string;
  isDirectory: boolean;
  path: string;
}

export default function FolderContentView() {
  const params = useParams<{ folderName: string[] }>();
  const folderPath = params?.folderName ? (Array.isArray(params.folderName) ? params.folderName.join('/') : params.folderName) : '';
  const [contents, setContents] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerFile, setViewerFile] = useState<{ name: string; type: string; url: string } | null>(null);

  const getActualFolderName = (slug: string): string => {
    const mapping: Record<string, string> = {
      "object-detection-models": "OBJECT DETECTION MODELS",
      "segmentation-models": "SEGMENTATION MODELS"
    };
    return mapping[slug] || slug;
  };

  useEffect(() => {
    if (!folderPath) return;

    const decodedPath = decodeURIComponent(folderPath);
    const actualFolderName = getActualFolderName(decodedPath.split('/')[0]);
    const fullPath = decodedPath.includes('/') ? decodedPath.replace(decodedPath.split('/')[0], actualFolderName) : actualFolderName;
    
    const staticContents: Record<string, FileSystemEntry[]> = {
      "OBJECT DETECTION MODELS": [
        { name: "YOLO v11 MEDIUM 120 EPOCHS", isDirectory: true, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS" }
      ],
      "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS": [
        { name: "INTERPRETATION", isDirectory: true, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION" },
        { name: "best-od.pt", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/best-od.pt" }
      ],
      "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION": [
        { name: "args.yaml", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/args.yaml" },
        { name: "BoxF1_curve.png", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/BoxF1_curve.png" },
        { name: "BoxPR_curve.png", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/BoxPR_curve.png" },
        { name: "BoxR_curve.png", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/BoxR_curve.png" },
        { name: "confusion_matrix_normalized.png", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/confusion_matrix_normalized.png" },
        { name: "confusion_matrix.png", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/confusion_matrix.png" },
        { name: "labels.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/labels.jpg" },
        { name: "results.csv", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/results.csv" },
        { name: "results.png", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/results.png" },
        { name: "train_batch0.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/train_batch0.jpg" },
        { name: "train_batch1.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/train_batch1.jpg" },
        { name: "train_batch2.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/train_batch2.jpg" },
        { name: "train_batch29150.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/train_batch29150.jpg" },
        { name: "train_batch29151.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/train_batch29151.jpg" },
        { name: "train_batch29152.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/train_batch29152.jpg" },
        { name: "val_batch0_labels.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/val_batch0_labels.jpg" },
        { name: "val_batch0_pred.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/val_batch0_pred.jpg" },
        { name: "val_batch1_labels.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/val_batch1_labels.jpg" },
        { name: "val_batch1_pred.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/val_batch1_pred.jpg" },
        { name: "val_batch2_labels.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/val_batch2_labels.jpg" },
        { name: "val_batch2_pred.jpg", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/val_batch2_pred.jpg" },
        { name: "yolo-11m-object-detection (1).ipynb", isDirectory: false, path: "OBJECT DETECTION MODELS/YOLO v11 MEDIUM 120 EPOCHS/INTERPRETATION/yolo-11m-object-detection (1).ipynb" }
      ],
      "SEGMENTATION MODELS": [
        { name: "FASTER R CNN", isDirectory: true, path: "SEGMENTATION MODELS/FASTER R CNN" },
        { name: "MASK R CNN 6000 ITER", isDirectory: true, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER" },
        { name: "YOLO v11 LARGE 50 EPOCHS", isDirectory: true, path: "SEGMENTATION MODELS/YOLO v11 LARGE 50 EPOCHS" },
        { name: "YOLO v11 MEDIUM 50 EPOCHS", isDirectory: true, path: "SEGMENTATION MODELS/YOLO v11 MEDIUM 50 EPOCHS" },
        { name: "YOLO V11 MEDIUM 60 EPOCHS", isDirectory: true, path: "SEGMENTATION MODELS/YOLO V11 MEDIUM 60 EPOCHS" }
      ],
      "SEGMENTATION MODELS/FASTER R CNN": [
        { name: "Faster_RCNN.ipynb", isDirectory: false, path: "SEGMENTATION MODELS/FASTER R CNN/Faster_RCNN.ipynb" }
      ],
      "SEGMENTATION MODELS/MASK R CNN 6000 ITER": [
        { name: "RUN 1 FAIL", isDirectory: true, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 1 FAIL" },
        { name: "RUN 2 SUCCESS", isDirectory: true, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 2 SUCCESS" }
      ],
      "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 1 FAIL": [
        { name: "Mask_RCNN_FINAL VERDICT.ipynb", isDirectory: false, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 1 FAIL/Mask_RCNN_FINAL VERDICT.ipynb" },
        { name: "model_final (1).pth", isDirectory: false, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 1 FAIL/model_final (1).pth" },
        { name: "model_final (2).pth", isDirectory: false, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 1 FAIL/model_final (2).pth" },
        { name: "model_final.pth", isDirectory: false, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 1 FAIL/model_final.pth" }
      ],
      "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 2 SUCCESS": [
        { name: "Mask_RCNN_success.ipynb", isDirectory: false, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 2 SUCCESS/Mask_RCNN_success.ipynb" },
        { name: "model_final (3).pth", isDirectory: false, path: "SEGMENTATION MODELS/MASK R CNN 6000 ITER/RUN 2 SUCCESS/model_final (3).pth" }
      ],
      "SEGMENTATION MODELS/YOLO v11 LARGE 50 EPOCHS": [
        { name: "best (8).pt", isDirectory: false, path: "SEGMENTATION MODELS/YOLO v11 LARGE 50 EPOCHS/best (8).pt" },
        { name: "YOLO_v11_LargeSegmentModel.ipynb", isDirectory: false, path: "SEGMENTATION MODELS/YOLO v11 LARGE 50 EPOCHS/YOLO_v11_LargeSegmentModel.ipynb" }
      ],
      "SEGMENTATION MODELS/YOLO v11 MEDIUM 50 EPOCHS": [
        { name: "best (9).onnx", isDirectory: false, path: "SEGMENTATION MODELS/YOLO v11 MEDIUM 50 EPOCHS/best (9).onnx" },
        { name: "best-seg.pt", isDirectory: false, path: "SEGMENTATION MODELS/YOLO v11 MEDIUM 50 EPOCHS/best-seg.pt" },
        { name: "YOLO_v11_MedSegmentModel.ipynb", isDirectory: false, path: "SEGMENTATION MODELS/YOLO v11 MEDIUM 50 EPOCHS/YOLO_v11_MedSegmentModel.ipynb" }
      ],
      "SEGMENTATION MODELS/YOLO V11 MEDIUM 60 EPOCHS": [
        { name: "best (7).pt", isDirectory: false, path: "SEGMENTATION MODELS/YOLO V11 MEDIUM 60 EPOCHS/best (7).pt" }
      ]
    };

    setContents(staticContents[fullPath] || []);
    setLoading(false);
  }, [folderPath]);

  const handleBack = () => {
    window.history.back();
  };

const closeViewer = () => {
    setViewerOpen(false);
    setViewerFile(null);
  };

  // Function to determine file type and icon
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return <File className="w-5 h-5 text-gray-500" />;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    } else if (['pdf'].includes(extension)) {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (['txt', 'md'].includes(extension)) {
      return <FileText className="w-5 h-5 text-green-500" />;
    } else if (['ipynb', 'py', 'js', 'ts', 'jsx', 'tsx'].includes(extension)) {
      return <FileText className="w-5 h-5 text-yellow-500" />;
    } else if (['csv', 'xlsx'].includes(extension)) {
      return <FileText className="w-5 h-5 text-green-600" />;
    } else if (['pt', 'pth', 'onnx', 'pb', 'h5'].includes(extension)) {
      return <FileText className="w-5 h-5 text-purple-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleFileClick = (fileName: string, isDirectory: boolean, entryPath: string) => {
    if (isDirectory) {
      window.location.href = `/research-mode/experimentation/${encodeURIComponent(entryPath)}`;
    } else {
      const extension = fileName.split('.').pop()?.toLowerCase();
      const fileUrl = `/MODELS/${entryPath}`;
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf'].includes(extension || '')) {
        setViewerFile({ name: fileName, type: extension || '', url: fileUrl });
        setViewerOpen(true);
      } else {
        window.open(fileUrl, '_blank');
      }
    }
  };

  // Render the file viewer modal
  const renderViewer = () => {
    if (!viewerOpen || !viewerFile) return null;

    const { name, type, url } = viewerFile;
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(type);
    const isPdf = type === 'pdf';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b bg-gray-100 dark:bg-gray-700">
            <h3 className="font-semibold text-lg truncate max-w-xs md:max-w-md lg:max-w-lg">{name}</h3>
            <button
              onClick={closeViewer}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow overflow-auto p-4 flex items-center justify-center">
            {isImage && (
              <img
                src={url}
                alt={name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
            {isPdf && (
              <iframe
                src={url}
                className="w-full h-[70vh] border-0"
                title={name}
              />
            )}
            {!isImage && !isPdf && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p>Preview not available for this file type</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-xl w-full text-center border-2 border-amber-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-amber-700 dark:text-amber-300">Loading folder contents...</p>
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">This may take a moment for large folders</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-xl w-full text-center border-2 border-amber-300">
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">Error Loading Contents</h1>
            <p className="text-red-500 mb-6">{error}</p>
            <button 
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!folderPath) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-xl w-full text-center border-2 border-amber-300">
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">Invalid Folder</h1>
            <p className="text-amber-700 dark:text-amber-300 mb-6">No folder specified.</p>
            <button 
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow flex flex-col p-4">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 w-full h-full border-2 border-amber-300">
          <div className="relative flex items-center justify-center mb-6">
            <button 
              onClick={handleBack}
              className="absolute left-0 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-gray-800 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-100 px-16 text-center break-words">
              {decodeURIComponent(folderPath).split('/').pop()}
            </h1>
          </div>
          
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-6 text-center">
            Contents of the selected folder
          </p>
          
          <div className="w-full">
            {contents.length === 0 ? (
              <div className="text-center py-8 text-amber-700 dark:text-amber-300">
                <Folder className="w-12 h-12 mx-auto text-amber-400 mb-3" />
                <p>This folder is empty</p>
              </div>
            ) : (
              <ul className="divide-y divide-amber-100 dark:divide-amber-800">
                {contents.map((entry, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-3 py-3 hover:bg-amber-50 dark:hover:bg-gray-800/50 rounded-lg px-2 transition-colors cursor-pointer"
                    onClick={() => handleFileClick(entry.name, entry.isDirectory, entry.path)}
                  >
                    {entry.isDirectory ? (
                      <>
                        <Folder className="w-5 h-5 text-amber-500" />
                        <span className="font-medium text-amber-900 dark:text-amber-100">{entry.name}</span>
                      </>
                    ) : (
                      <>
                        {getFileIcon(entry.name)}
                        <span className="text-gray-700 dark:text-gray-300">{entry.name}</span>
                        {(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf'].includes(entry.name.split('.').pop()?.toLowerCase() || '')) ? (
                          <Eye className="w-4 h-4 ml-auto text-amber-500" />
                        ) : (
                          <Download className="w-4 h-4 ml-auto text-gray-400" />
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {viewerOpen && renderViewer()}
    </div>
  );
}
