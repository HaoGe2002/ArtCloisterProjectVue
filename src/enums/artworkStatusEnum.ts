// 前端艺术品状态枚举
export enum ArtworkStatusEnum {
    UNREVIEWED = 0,      // 未审核
    UNDER_REVIEW = 1,    // 审核中
    APPROVED = 2,        // 审核通过
    REJECTED = 3,        // 审核未通过
    LISTED = 4,          // 上架
    SOLD = 5,            // 售出
    UNLISTED = 6         // 下架
  }
  
  /**
   * 根据 `statusId` 获取状态名称
   */
  export const getArtworkStatusName = (statusId: number): string => {
    const statusMap: Record<number, string> = {
      [ArtworkStatusEnum.UNREVIEWED]: "未审核",
      [ArtworkStatusEnum.UNDER_REVIEW]: "审核中",
      [ArtworkStatusEnum.APPROVED]: "审核通过",
      [ArtworkStatusEnum.REJECTED]: "审核未通过",
      [ArtworkStatusEnum.LISTED]: "上架",
      [ArtworkStatusEnum.SOLD]: "售出",
      [ArtworkStatusEnum.UNLISTED]: "下架"
    };
    return statusMap[statusId] || "未知状态";
  };
  