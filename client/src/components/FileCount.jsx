import React, { useEffect, useState } from 'react';
import { getFilesCount } from '../services/FileService';

const FileCount = ({ refreshTrigger }) => {
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    const fetchFileCount = async () => {
      const count = await getFilesCount();
      setTotalFiles(count);
    };
    fetchFileCount();
  }, [refreshTrigger]);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Total Files</h2>
      <p className="text-3xl font-bold text-blue-600">{totalFiles}</p>
    </div>
  );
};

export default FileCount;