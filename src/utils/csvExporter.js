import { createObjectCsvWriter } from 'csv-writer';
import { createReadStream } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

export const exportToCsv = async ({ records, header, filenamePrefix }) => {
  const filePath = path.join(tmpdir(), `${filenamePrefix}-${Date.now()}.csv`);
  const writer = createObjectCsvWriter({
    path: filePath,
    header,
  });
  await writer.writeRecords(records);
  return filePath;
};

export const streamCsvToResponse = (res, filePath, downloadName) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  const fileStream = createReadStream(filePath);
  fileStream.pipe(res);
};

