export class CreatePostDto {
  martId: number; // Mart id
  image: string | File; // 이미지 url ?
  startDate: string; // 전단 시작날짜
  endDate: string; // 전단 종료날짜
  key: string; // s3 키?
}
