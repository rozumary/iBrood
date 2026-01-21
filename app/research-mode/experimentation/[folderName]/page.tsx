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
  const params = useParams<{ folderName: string }>();
  const folderName = params?.folderName;
  const [contents, setContents] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerFile, setViewerFile] = useState<{ name: string; type: string; url: string } | null>(null);

  useEffect(() => {
    if (!folderName) return;

    const fetchFolderContents = async () => {
      try {
        setLoading(true);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(`/api/models/${folderName}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch contents: ${response.statusText}`);
        }
        
        const data = await response.json();
        setContents(data.contents || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching folder contents:", err);
        if (err instanceof Error && err.name === 'AbortError') {
          setError("Request timed out. The folder might be too large.");
        } else {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFolderContents();
  }, [folderName]);

  const handleBack = () => {
    window.history.back();
  };

  const openViewer = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const currentPath = decodeURIComponent(folderName || '');
    const fileUrl = `/MODELS/${currentPath ? `${currentPath}/` : ''}${encodeURIComponent(fileName)}`;
    
    setViewerFile({
      name: fileName,
      type: extension || '',
      url: fileUrl
    });
    setViewerOpen(true);
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

  // Function to handle file click
  const handleFileClick = (fileName: string, isDirectory: boolean) => {
    if (isDirectory) {
      // Navigate to subdirectory - combine current path with subfolder name
      const currentPath = decodeURIComponent(folderName || '');
      const newPath = currentPath ? `${currentPath}/${fileName}` : fileName;
      window.location.href = `/research-mode/experimentation/${encodeURIComponent(newPath)}`;
    } else {
      // For image and pdf files, open in viewer modal
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf'].includes(extension || '')) {
        openViewer(fileName);
      } else {
        // For other files, initiate download
        const currentPath = decodeURIComponent(folderName || '');
        const fileUrl = `/MODELS/${currentPath ? `${currentPath}/` : ''}${encodeURIComponent(fileName)}`;
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
              Back to Folders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!folderName) {
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
              Back to Folders
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
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-gray-800 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Folders
            </button>
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 text-center flex-1">
              {decodeURIComponent(folderName)}
            </h1>
            <div className="w-28"></div> {/* Spacer to center the header */}
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
                    onClick={() => handleFileClick(entry.name, entry.isDirectory)}
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
