export class BaseUrls {

  public static readonly BASE_HREF: string = "http://localhost:8080";
  // For EC2
  //public static readonly BASE_HREF: string = "http://ec2-3-80-132-80.compute-1.amazonaws.com:8080";

  public static readonly ADMIN_GROUPURL: string = "adminauth";
  public static readonly USER_GROUPURL: string = "users";

  public static getUrl(key: string): string { return `${this.BASE_HREF}/${key}/get`;}
  public static getAddUrl(key: string): string { return `${this.BASE_HREF}/${key}/add`;}
  public static getUpdateUrl(key: string): string { return `${this.BASE_HREF}/${key}/update`;}
  public static getDeleteUrl(key: string): string { return `${this.BASE_HREF}/${key}/delete`;}
  public static getLoginUrl(key: string): string { return `${this.BASE_HREF}/${key}/login`;}
  
}