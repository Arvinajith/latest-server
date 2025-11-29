export const handleUpload = (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const assets = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
    type: file.mimetype.includes('video') ? 'video' : 'image',
  }));

  res.status(201).json({ assets });
};

