import {
  Controller, Post, Get, Param, Res,
  UploadedFile, UseInterceptors, HttpCode, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { FilesService } from './files.service';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 МБ

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // POST /files — прийняти файл, провалідувати, зберегти
  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        // Зберігаємо під UUID-назвою — не під originalname (захист від path traversal)
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      // Жорсткий ліміт на рівні Multer — обриває прийом ДО повного завантаження в пам'ять
      limits: { fileSize: MAX_SIZE_BYTES },
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_SIZE_BYTES }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const metadata = this.filesService.save({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    return metadata;
  }

  // GET /files — список метаданих всіх завантажених файлів
  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  // GET /files/:name — роздача файлу за назвою
  @Get(':name')
  serveFile(@Param('name') name: string, @Res() res: Response) {
    const filePath = path.join(UPLOAD_DIR, name);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Файл не знайдено' });
    }
    res.sendFile(filePath);
  }
}
