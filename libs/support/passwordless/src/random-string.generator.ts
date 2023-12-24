
export enum RandomStringType {
  NUMBER = 1,
  LOWER = 2,
  UPPER = 3,
  ALPHA = 4,
}

export interface RandomStringGenerator {
  generate(length: number, type: RandomStringType);
}

export class DefaultRandomStringGenerator implements RandomStringGenerator {
  generate(length: number, type: RandomStringType) {
    let base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    switch (type) {
      // 纯数字
      case RandomStringType.NUMBER:
        base = base.substring(0,10);
        break;
      // 小写字母			
      case RandomStringType.LOWER:
        base = base.substring(10,36);
        break;
      // 大写字母	
      case RandomStringType.UPPER:
        base = base.substring(36,62);
        break;
      // 大小写字母
      case RandomStringType.ALPHA:
        base = base.substring(10,62);
        break;
      default:
        break;
    }

    let str = '';
    while (length--) {
      str += base[this.getRandomNum(0, base.length - 1)];
    }
    return str;
  }

  getRandomNum(min: number, max: number) {
    return Math.round(min + (max - min ) * Math.random());
  }
}
