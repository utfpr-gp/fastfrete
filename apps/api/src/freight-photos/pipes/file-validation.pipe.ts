import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export type ValidatedFile = Express.Multer.File & {
  detectedExtension?: string;
};

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(value: ValidatedFile | undefined): Promise<ValidatedFile> {
    if (!value) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    if (!value.buffer) {
      throw new BadRequestException('Arquivo inválido');
    }

    if (value.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Tamanho do arquivo excede o limite de 5MB. Tamanho atual: ${(value.size / (1024 * 1024)).toFixed(2)}MB`,
      );
    }

    const fileType = await fileTypeFromBuffer(value.buffer);

    if (!fileType) {
      throw new BadRequestException(
        'Não foi possível determinar o tipo do arquivo',
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType.mime)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Tipos aceitos: JPG, PNG, GIF, WEBP. Detectado: ${fileType.ext || 'desconhecido'}`,
      );
    }

    // Extensão definida pelo conteúdo real do arquivo, e não pelo nome enviado
    value.detectedExtension = `.${fileType.ext === 'jpg' ? 'jpg' : fileType.ext}`;
    return value;
  }
}
