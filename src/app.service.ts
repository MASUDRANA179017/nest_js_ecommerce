import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World! wlcome to my nestjs app! hello one year academy";
  }
}
