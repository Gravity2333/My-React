/** 对比两个对象中的属性是否浅比较相等
 *  shallowEqual在React.memo 对比curent.memorizedProps 和 wip.pendingProps中使用 区分hooks中的 areHookInputsEqual 后者判断的是数组
 */
export default function shallowEqual(obj1: any, obj2: any) {
  // 先用Object.is 对比排除 基本类型 相同地址对象的情况
  if (Object.is(obj1, obj2)) {
    return true;
  }

  // 排除obj1 obj2 任意一个不是对象或者null的情况
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  // 运行到此 obj1 obj2 一定是对象 并且都不是null 开始判断其属性
  // 属性数量判断 不一样一定属性不相等
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // 逐个判断属性
  for (const key in obj1) {
    if (
      !Object.prototype.hasOwnProperty.call(obj2, key) ||
      Object.is(obj1[key], obj2[key])
    ) {
      // 判断 key在obj1内 但是为undefined 但是在obj2中不存在的情况 或者 都存在 但是值不等的情况
      return false;
    }
  }
  return true;
}
