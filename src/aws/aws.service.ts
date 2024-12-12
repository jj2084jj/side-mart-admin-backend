import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `images/${Date.now()}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return {
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async saveImageFromUrl(imageUrl: string): Promise<string> {
    try {
      // 1. 이미지 URL로부터 다운로드
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the image');
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // 2. 파일 이름을 URL에서 추출 (URL 마지막 부분을 파일 이름으로 사용)
      const fileName = path.basename(imageUrl);

      // 3. 파일 경로 설정
      const filePath = path.join(fileName);

      // 4. 이미지 파일을 로컬 파일 시스템에 저장
      fs.writeFileSync(filePath, buffer);
      return filePath; // 저장된 파일 경로를 반환
    } catch (error) {
      throw new Error('Failed to download and save image');
    }
  }

  async saveAndUploadImage(imageUrl: string) {
    const savedImagePath = await this.saveImageFromUrl(imageUrl);

    // 예시로 S3에 업로드하는 경우:
    const uploadedImage = await this.uploadToS3(savedImagePath); // S3에 업로드하는 함수
    return uploadedImage;
  }

  async uploadToS3(filePath: string) {
    const fileStream = fs.createReadStream(filePath);

    const key = `images/${Date.now()}_${path.basename(filePath)}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: 'image/jpeg', // 이미지 타입에 맞게 설정 (예: image/png 등)
    };

    const command = new PutObjectCommand(uploadParams);

    try {
      await this.s3Client.send(command);

      fs.unlinkSync(filePath);
      return {
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
