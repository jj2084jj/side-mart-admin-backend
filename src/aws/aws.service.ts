import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private bucketName: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.baseUrl = this.configService.get<string>('AWS_S3_BASE_URL');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    });

    try {
      await this.s3Client.send(command);
      console.log(`${this.baseUrl}/${key}`,'!!!! aws 파일 추가')
      return `${this.baseUrl}/${key}`; // 업로드된 파일의 URL 반환
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
