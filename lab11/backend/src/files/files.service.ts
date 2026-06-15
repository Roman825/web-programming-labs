import { Injectable } from '@nestjs/common';

export interface FileMetadata {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

@Injectable()
export class FilesService {
  // Метадані зберігаються в пам'яті (без БД як вимагає умова)
  private files: FileMetadata[] = [];

  save(data: Omit<FileMetadata, 'id' | 'url' | 'uploadedAt'>): FileMetadata {
    const metadata: FileMetadata = {
      id: Date.now().toString(),
      ...data,
      url: `http://localhost:3000/files/${data.filename}`,
      uploadedAt: new Date().toISOString(),
    };
    this.files.push(metadata);
    return metadata;
  }

  findAll(): FileMetadata[] {
    return this.files;
  }
}
