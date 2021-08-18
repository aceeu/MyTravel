export interface IconInfo {
    className: string;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  }
  
  export interface IconInfoMap {
    [key: string]: IconInfo;
  }
  
  // istanbul ignore next
  export function getIconInfo(map: IconInfoMap, key: string): IconInfo {
    if (key in map) {
      return map[key];
    }
  
    console.warn(`IconInfo: no information for '${key}'.`);
    return iconInfo('', 0, 0, 0, 0);
  }
  
  // istanbul ignore next
  export function iconInfo(className: string, offsetX: number, offsetY: number, width: number, height: number): IconInfo {
    return {className, offsetX, offsetY, width, height};
  }