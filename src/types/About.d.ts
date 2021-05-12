/**
 * 这是一个 Embedded Entities
 * 文档： https://typeorm.io/#/embedded-entities
 */
export interface About {
  /**
   * 长段介绍
   */
  description: string | null;

  /**
   * 介绍页的图
   */
  banner: string | null;

  /**
   * 介绍页的图标题
   */
  bannerDescription: string | null;

  /**
   * About 页面的联系方式（预留字段）
   */
  telegram: string | null;

  twitter: string | null;

  medium: string | null;

  facebook: string | null;

  discord: string | null;

  email: string | null;
}
